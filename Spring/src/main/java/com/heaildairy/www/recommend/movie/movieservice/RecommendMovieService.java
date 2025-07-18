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
import com.heaildairy.www.recommend.movie.movieresponse.MovieCreditsResponse;
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


    public MovieListResponse recommendByTodayDiaryWeighted(UserEntity user) {
        // 1. 오늘 일기 조회
        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(user.getUserId(), LocalDate.now());
        if (todayDiary.isEmpty()) return new MovieListResponse(List.of(), Map.of(), List.of());

        // 2. 감정 리스트 가져오기
        List<MoodDetail> moodDetails = moodDetailRepository.findByDiaryDiaryId(todayDiary.get().getDiaryId());
        if (moodDetails.isEmpty()) return new MovieListResponse(List.of(), Map.of(), List.of());

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

        // 4. 장르 점수 내림차순 정렬 (상위 장르 추출)
        List<Integer> topGenres = genreScores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // 5. 유저가 싫어요한 영화 키 조회
        List<Integer> dislikedMovieKeys = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream().map(DisLikeMoviesEntity::getMovieKey).toList();

        // 6. 장르 기반 추천 영화 조회 (최종 종합 추천 목록)
        Set<Integer> usedMovieIds = new HashSet<>();
        List<MovieDto> combinedResults = new ArrayList<>();
        for (Integer genreCode : topGenres) {
            if (combinedResults.size() >= 10) break;

            List<MovieDto> candidates = tmdbApiClientService.searchMoviesByGenre(genreCode);
            for (MovieDto movie : candidates) {
                if (combinedResults.size() >= 10) break;
                if (!dislikedMovieKeys.contains(movie.getMovieKey()) && usedMovieIds.add(movie.getMovieKey())) {
                    combinedResults.add(movie);
                }
            }
        }

        combinedResults.forEach(movie ->{
            MovieDto movieDto = tmdbApiClientService.getMovieCreditsWithDetails(movie.getMovieKey().toString());
            movie.setCastNames(movieDto.getCastNames());
            movie.setDirectorName(movieDto.getDirectorName());
        });

        // 7. 트레일러 추가
        combinedResults.forEach(movie ->
                movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getMovieKey())))
        );

        // 8. 감정별 상세 추천 결과 구성
        Map<String, List<MovieDto>> resultsByEmotion = new LinkedHashMap<>();
        for (MoodDetail mood : moodDetails) {
            System.out.println("Emotion (raw): [" + mood.getEmotionType() + "]");

            String emotion = mood.getEmotionType();
            double emotionPercentage = mood.getPercentage();

            Map<Integer, Double> genreScoresByEmotion = new HashMap<>();
            List<EmotionGenreMapEntity> mappings = emotionGenreMapRepository.findByEmotionTypeOrdered(emotion);
            for (EmotionGenreMapEntity mapping : mappings) {
                genreScoresByEmotion.put(mapping.getGenreCode(), mapping.getGenreWeight() * emotionPercentage);
            }

            System.out.println("Emotion: " + emotion + ", GenreScores: " + genreScoresByEmotion);

            List<Integer> sortedGenres = genreScoresByEmotion.entrySet().stream()
                    .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            System.out.println("Sorted Genres for " + emotion + ": " + sortedGenres);

            Set<Integer> emotionUsedMovieIds = new HashSet<>();
            List<MovieDto> emotionResults = new ArrayList<>();

            for (Integer genreCode : sortedGenres) {
                if (emotionResults.size() >= 10) break;

                List<MovieDto> candidates = tmdbApiClientService.searchMoviesByGenre(genreCode);
                for (MovieDto movie : candidates) {
                    if (emotionResults.size() >= 10) break;
                    if (!dislikedMovieKeys.contains(movie.getMovieKey()) && emotionUsedMovieIds.add(movie.getMovieKey())) {
                        movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getMovieKey())));
                        emotionResults.add(movie);
                    }
                }
            }

            emotionResults.forEach(movie -> {
                MovieDto movieDto = tmdbApiClientService.getMovieCreditsWithDetails(movie.getMovieKey().toString());
                movie.setCastNames(movieDto.getCastNames());
                movie.setDirectorName(movieDto.getDirectorName());
            });

            resultsByEmotion.put(emotion, emotionResults);
        }

        // 9. 감정 DTO 변환
        List<MoodDetailDto> moodDtos = moodDetails.stream()
                .map(MoodDetailDto::fromEntity)
                .toList();

        // 10. 최종 응답
        return new MovieListResponse(combinedResults, resultsByEmotion, moodDtos);
    }


//    public MovieListResponse recommendByTodayDiaryWeighted(UserEntity user) {
//        // 1. 오늘 일기 조회
//        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(user.getUserId(), LocalDate.now());
//        if (todayDiary.isEmpty()) return new MovieListResponse(List.of(), Map.of(), List.of());
//
//        // 2. 감정 리스트 가져오기
//        List<MoodDetail> moodDetails = moodDetailRepository.findByDiaryDiaryId(todayDiary.get().getDiaryId());
//
//        // 3. 감정이 없거나 전부 '중립/기타'일 경우: 설문 기반 추천
//        boolean useSurveyInstead = (moodDetails == null || moodDetails.isEmpty()
//                || moodDetails.stream().allMatch(m -> m.getEmotionType().equals("중립/기타")));
//
//        List<EmotionGenreMapEntity> genreWeights;
//        if (useSurveyInstead) {
//            genreWeights = generateGenreWeightsFromInitialSurvey(user);
//            log.info("초기 설문 기반 추천 사용, 계산된 장르 가중치: {}", genreWeights);
//        } else {
//            // 4. 감정-장르 가중치 계산
//            Map<Integer, Double> genreScores = new HashMap<>();
//            for (MoodDetail mood : moodDetails) {
//                List<EmotionGenreMapEntity> mappings = emotionGenreMapRepository.findByEmotionTypeOrdered(mood.getEmotionType());
//                for (EmotionGenreMapEntity mapping : mappings) {
//                    genreScores.merge(
//                            mapping.getGenreCode(),
//                            mapping.getGenreWeight() * mood.getPercentage(),
//                            Double::sum
//                    );
//                }
//            }
//
//            // 5. 장르 점수 내림차순 정렬
//            List<Integer> topGenres = genreScores.entrySet().stream()
//                    .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
//                    .map(Map.Entry::getKey)
//                    .collect(Collectors.toList());
//
//            genreWeights = topGenres.stream()
//                    .map(code -> new EmotionGenreMapEntity(null, null, code,
//                            genreScores.getOrDefault(code, 0.0)))
//                    .toList();
//            log.debug("감정 기반 장르 가중치: {}", genreWeights);
//        }
//
//        // 6. 싫어요 리스트 조회
//        List<String> dislikedMovieKeys = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
//                .stream().map(DisLikeMoviesEntity::getMovieKey).toList();
//
//        // 7. 감정 기반 추천 영화 구성
//        Map<String, List<MovieDto>> resultsByEmotion = new LinkedHashMap<>();
//        List<MovieDto> combinedResults = new ArrayList<>();
//
//        Set<Integer> usedMovieIds = new HashSet<>();
//        for (EmotionGenreMapEntity genreWeight : genreWeights) {
//            int genreCode = genreWeight.getGenreCode();
//            List<MovieDto> candidates = tmdbApiClientService.searchMoviesByGenre(genreCode);
//
//            for (MovieDto movie : candidates) {
//                if (combinedResults.size() >= 10) break;
//                if (!dislikedMovieKeys.contains(String.valueOf(movie.getId())) && usedMovieIds.add(movie.getId())) {
//                    movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getId())));
//                    combinedResults.add(movie);
//                }
//            }
//            if (combinedResults.size() >= 10) break;
//        }
//
//        // 감정별 추천은 useSurvey일 경우 빈 Map으로 대체
//        if (!useSurveyInstead) {
//            for (MoodDetail mood : moodDetails) {
//                String emotion = mood.getEmotionType();
//                List<Integer> genreCodes = emotionGenreMapRepository.findByEmotionTypeOrdered(emotion)
//                        .stream().map(EmotionGenreMapEntity::getGenreCode).toList();
//
//                Set<Integer> innerUsed = new HashSet<>();
//                List<MovieDto> emotionResults = new ArrayList<>();
//                for (Integer genreCode : genreCodes) {
//                    if (emotionResults.size() >= 10) break;
//                    List<MovieDto> candidates = tmdbApiClientService.searchMoviesByGenre(genreCode);
//                    for (MovieDto movie : candidates) {
//                        if (emotionResults.size() >= 10) break;
//                        if (!dislikedMovieKeys.contains(String.valueOf(movie.getId())) && innerUsed.add(movie.getId())) {
//                            movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getId())));
//                            emotionResults.add(movie);
//                        }
//                    }
//                }
//                resultsByEmotion.put(emotion, emotionResults);
//            }
//        }
//
//        List<MoodDetailDto> moodDtos = moodDetails.stream()
//                .map(MoodDetailDto::fromEntity)
//                .toList();
//
//        return new MovieListResponse(combinedResults, resultsByEmotion, moodDtos);
//    }
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
        List<Integer> disliked = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream().map(e -> e.getMovieKey()).collect(Collectors.toList());

        List<MovieDto> combined = new ArrayList<>();
        for (EmotionGenreMapEntity em : genreWeights) {
            List<MovieDto> movies = tmdbApiClientService.searchMoviesByGenre(em.getGenreCode());
            combined.addAll(movies.stream()
                    .filter(m -> !disliked.contains(String.valueOf(m.getMovieKey())))
                    .collect(Collectors.toList()));
        }

        Map<Integer, MovieDto> distinct = new LinkedHashMap<>();
        combined.forEach(m -> distinct.putIfAbsent(m.getMovieKey(), m));

        distinct.values().forEach(m ->
                m.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(m.getMovieKey()))));

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
        if (initEmo == null || initEmo.isEmpty()) {
            initEmo = Collections.emptyList();
        } // 현재 설문이 없어 임시로 코드 추가, 설문 구현후 코드 제거

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