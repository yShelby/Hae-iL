package com.heaildairy.www.recommend.movie.movieservice;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.diary.entity.DiaryEntity;
import com.heaildairy.www.diary.repository.DiaryRepository;
import com.heaildairy.www.emotion.dto.MoodDetailDto;
import com.heaildairy.www.emotion.entity.MoodDetail;
import com.heaildairy.www.emotion.repository.MoodDetailRepository;
import com.heaildairy.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.heaildairy.www.recommend.movie.movieentity.EmotionGenreMapEntity;
import com.heaildairy.www.recommend.movie.movierepository.DisLikeMoviesRepository;
import com.heaildairy.www.recommend.movie.movierepository.EmotionGenreMapRepository;
import com.heaildairy.www.recommend.movie.moviedto.MovieDto;
import com.heaildairy.www.recommend.movie.movieresponse.MovieListResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 감정 기반 영화 추천 서비스
 * - 감정(emotionType)에 따라 매핑된 장르 가중치 정보를 기반으로 영화를 추천함
 * - 사용자가 '싫어요'한 영화는 제외하고 추천함
 * - TMDB API에서 장르별 영화 조회 및 트레일러 정보 추가
 * - 추천 결과는 비동기적으로 반환 (Mono<List<MovieDTO>>)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendMovieService {

    private final EmotionGenreMapRepository emotionGenreMapRepository;
    private final DisLikeMoviesRepository disLikeMoviesRepository;
    private final TmdbApiClientService tmdbApiClientService;
    private final DiaryRepository diaryRepository;
    private final MoodDetailRepository moodDetailRepository;


    public List<MovieDto> recommendByTodayDiaryWeighted(UserEntity user) {
        // 1. 오늘 일기 조회
        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(user.getUserId(), LocalDate.now());
        if (todayDiary.isEmpty()) return List.of();

        // 2. 감정 리스트 가져오기
        List<MoodDetail> moodDetails = moodDetailRepository.findByDiaryDiaryId(todayDiary.get().getDiaryId());
        if (moodDetails.isEmpty()) return List.of();

        // 3. 감정-장르 가중치 계산
        Map<Integer, Double> genreScores = new HashMap<>();
        for (MoodDetail mood : moodDetails) {
            List<EmotionGenreMapEntity> mappings = emotionGenreMapRepository.findByEmotionTypeOrdered(mood.getEmotionType());
            for (EmotionGenreMapEntity mapping : mappings) {
                genreScores.merge(
                        mapping.getGenreCode(),
                        mapping.getGenreWeight() * mood.getPercentage(),
                        Double::sum
                );
            }
        }

        // 4. 장르 점수 내림차순 정렬
        List<Integer> topGenres = genreScores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // 5. TMDB에서 영화 검색
        List<String> dislikedMovieKeys = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream().map(DisLikeMoviesEntity::getMovieKey).toList();

        Map<Integer, MovieDto> finalMovies = new LinkedHashMap<>();
        for (Integer genreCode : topGenres) {
            List<MovieDto> candidates = tmdbApiClientService.searchMoviesByGenre(genreCode);
            for (MovieDto movie : candidates) {
                if (!dislikedMovieKeys.contains(String.valueOf(movie.getId()))) {
                    finalMovies.putIfAbsent(movie.getId(), movie);
                }
            }
        }

        // 6. 트레일러 추가
        finalMovies.values().forEach(movie -> {
            movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getId())));
        });

        List<MovieDto> movies = new ArrayList<>(finalMovies.values());

        List<MoodDetailDto> moodDtos = moodDetails.stream()
                .map(MoodDetailDto::fromEntity) // MoodDetail → MoodDetailDto 변환 메서드 필요
                .collect(Collectors.toList());


        return new MovieListResponse(movies, moodDtos).getResults();
    }


    /**
     * 감정 기반 영화 추천 메서드 (동기 방식)
     *
     * @param emotionType 감정 유형 (예: "기쁨", "슬픔")
     * @param user 현재 로그인한 사용자 정보
     * @return 추천 영화 리스트
     */
    public List<MovieDto> recommendByEmotion(String emotionType, UserEntity user) {
        log.info("영화 추천 요청 - 감정: {}, userId: {}", emotionType, user.getUserId());

        boolean useSurveyInstead = (emotionType == null || emotionType.equalsIgnoreCase("중립/기타"));

        List<EmotionGenreMapEntity> genreWeights;
        if (useSurveyInstead) {
            genreWeights = generateGenreWeightsFromInitialSurvey(user);
            log.info("초기 설문 기반 추천 사용, 계산된 장르 가중치: {}", genreWeights);
        } else {
            genreWeights = emotionGenreMapRepository.findByEmotionTypeOrdered(emotionType);
            log.debug("감정 기반 장르 가중치: {}", genreWeights);
        }

        // 2. 현재 사용자가 싫어요 표시한 영화 키 리스트 조회
        List<String> dislikedMovieKeys = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream()
                .map(entity -> entity.getMovieKey())
                .collect(Collectors.toList());
        log.debug("제외할 영화 키: {}", dislikedMovieKeys);

        // 3. 장르별로 TMDB API 호출 → 영화 검색 → 싫어요 영화 제거
        List<MovieDto> combinedMovies = new ArrayList<>();

        for (EmotionGenreMapEntity genreMap : genreWeights) {
            Integer genreCode = genreMap.getGenreCode();
            log.debug("장르 [{}]에 대한 영화 검색 시작", genreCode);

            // TMDB API 동기 호출
            List<MovieDto> movies = tmdbApiClientService.searchMoviesByGenre(genreCode);

            // 싫어요 영화 필터링
            List<MovieDto> filtered = movies.stream()
                    .filter(movie -> !dislikedMovieKeys.contains(String.valueOf(movie.getId())))
                    .collect(Collectors.toList());

            log.debug("장르 [{}] 필터링 후 남은 영화 수: {}", genreCode, filtered.size());

            combinedMovies.addAll(filtered);
        }

        // 4. 중복 영화 제거
        Map<Integer, MovieDto> distinctMovies = new LinkedHashMap<>();
        for (MovieDto movie : combinedMovies) {
            distinctMovies.putIfAbsent(movie.getId(), movie);
        }

        // 5. 영화마다 트레일러 URL 조회 후 추가 (동기 호출)
        for (MovieDto movie : distinctMovies.values()) {
            String trailerUrl = tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getId()));
            movie.setTrailerUrl(trailerUrl);
        }

        List<MovieDto> result = new ArrayList<>(distinctMovies.values());
        log.info("최종 추천 영화 수: {}", result.size());

        return result;
    }
    /**
     * 초기 설문 기반 장르 가중치 생성 메서드
     * - 사용자의 초기 설문 결과를 기반으로 장르 가중치를 생성함
     * - 예시: 사용자가 '코미디'를 좋아한다고 응답하면, 해당 장르의 가중치를 높임
     */
//    private List<EmotionGenreMapEntity> generateGenreWeightsFromInitialSurvey(UserEntity user) {
//        ObjectMapper objectMapper = new ObjectMapper();
//        List<String> initialEmotions;
//        List<String> initialGenres;
//
//        try {
//            initialEmotions = objectMapper.readValue(user.getInitialEmotion(), new TypeReference<>() {});
//            initialGenres = objectMapper.readValue(user.getInitialGenre(), new TypeReference<>() {});
//        } catch (Exception e) {
//            log.error("초기 설문 JSON 파싱 실패", e);
//            return Collections.emptyList(); // 예외 발생 시 빈 리스트 반환
//        }
//        Map<Integer, EmotionGenreMapEntity> genreWeightMap = new HashMap<>();
//
//        for(String emotion : initialEmotions) {
//            List<EmotionGenreMapEntity> mappings = emotionGenreMapRepository.findByEmotionTypeOrdered(emotion);
//            for(EmotionGenreMapEntity mapping : mappings) {
//                if (initialGenres.contains(mapping.getGenreName())) {
//                    // 장르가 초기 설문에 포함되어 있다면 가중치 누적
//                    genreWeightMap.merge(
//                            mapping.getGenreCode(),
//                            new EmotionGenreMapEntity(emotion, mapping.getGenreCode(), mapping.getGenreName(), mapping.getGenreWeight()),
//                            (oldVal, newVal) -> {
//                                oldVal.setGenreWeight(oldVal.getGenreWeight()+newVal.getGenreWeight());
//                                return oldVal;
//                            }
//                    );
//                }
//            }
//        }
//        return genreWeightMap.values().stream()
//                .sorted(Comparator.comparingDouble(EmotionGenreMapEntity::getGenreWeight).reversed())
//                .collect(Collectors.toList());
//    }
//}
    public List<MovieDto> recommendByInitialSurvey(UserEntity user) {
        List<EmotionGenreMapEntity> genreWeights = generateGenreWeightsFromInitialSurvey(user);
        return recommendByGenreWeights(genreWeights, user);
    }

    private List<MovieDto> recommendByGenreWeights(
            List<EmotionGenreMapEntity> genreWeights, UserEntity user
    ) {
        List<String> disliked = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream().map(e -> e.getMovieKey()).collect(Collectors.toList());

        List<MovieDto> combined = new ArrayList<>();
        for (EmotionGenreMapEntity em : genreWeights) {
            List<MovieDto> movies = tmdbApiClientService.searchMoviesByGenre(em.getGenreCode());
            combined.addAll(movies.stream()
                    .filter(m -> !disliked.contains(String.valueOf(m.getId())))
                    .collect(Collectors.toList()));
        }

        Map<Integer, MovieDto> distinct = new LinkedHashMap<>();
        combined.forEach(m -> distinct.putIfAbsent(m.getId(), m));

        distinct.values().forEach(m ->
                m.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(m.getId()))));

        return new ArrayList<>(distinct.values());
    }

    private List<EmotionGenreMapEntity> generateGenreWeightsFromInitialSurvey(UserEntity user) {
        ObjectMapper mapper = new ObjectMapper();
        List<String> initEmo, initGenres;
        try {
            initEmo = mapper.readValue(user.getInitialEmotion(), new TypeReference<>() {});
            initGenres = mapper.readValue(user.getInitialGenre(), new TypeReference<>() {});
        } catch (Exception e) {
            log.error("설문 JSON 파싱 실패", e);
            return Collections.emptyList();
        }

        Map<Integer, EmotionGenreMapEntity> map = new HashMap<>();
        for (String emo : initEmo) {
            emotionGenreMapRepository.findByEmotionTypeOrdered(emo).stream()
                    .filter(e -> initGenres.contains(e.getGenreName()))
                    .forEach(e -> map.merge(
                            e.getGenreCode(),
                            new EmotionGenreMapEntity(emo, e.getGenreCode(), e.getGenreName(), e.getGenreWeight()),
                            (a, b) -> { a.setGenreWeight(a.getGenreWeight() + b.getGenreWeight()); return a; }));
        }

        return map.values().stream()
                .sorted(Comparator.comparingDouble(EmotionGenreMapEntity::getGenreWeight).reversed())
                .collect(Collectors.toList());
    }
}