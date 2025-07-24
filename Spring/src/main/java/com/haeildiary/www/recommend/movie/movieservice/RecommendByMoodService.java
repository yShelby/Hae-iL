package com.haeildiary.www.recommend.movie.movieservice;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.mood.dto.MoodDetailDTO;
import com.haeildiary.www.mood.entity.MoodDetail;
import com.haeildiary.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.haeildiary.www.recommend.movie.movieentity.EmotionGenreMapEntity;
import com.haeildiary.www.recommend.movie.moviedto.MovieDto;
import com.haeildiary.www.recommend.movie.movieresponse.MovieListResponse;
import com.haeildiary.www.recommend.movie.movierepository.DisLikeMoviesRepository;
import com.haeildiary.www.recommend.movie.movierepository.EmotionGenreMapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendByMoodService {

    private final EmotionGenreMapRepository emotionGenreMapRepository;
    private final DisLikeMoviesRepository disLikeMoviesRepository;
    private final TmdbApiClientService tmdbApiClientService;
    private final DiaryMoodService diaryMoodService;
    private final MoodCacheService moodCacheService;

    private static final int TOTAL_RECOMMENDATION_COUNT = 10;
    private static final int PRIMARY_GENRE_RECOMMEND_COUNT = 5;
    private static final int SECONDARY_GENRE_RECOMMEND_COUNT = 3;
    private static final int TERTIARY_GENRE_RECOMMEND_COUNT = 2;

    /**
     * 오늘 일기 기반 감정 가중치에 따른 영화 추천 메서드
     * 1) 오늘 일기가 없으면 초기 설문 추천으로 대체
     * 2) 오늘 감정 데이터가 없거나 'neutral' 혹은 '기타' 포함 시 초기 설문 추천으로 대체
     * 3) 캐시된 감정과 동일하면 추천 수행하지 않고 변경 없음 반환
     * 4) 감정 변화 있을 때만 추천 로직 수행
     */
    public MovieListResponse recommendByTodayDiaryWeighted(UserEntity user) {
        Optional<DiaryEntity> todayDiaryOpt = diaryMoodService.getTodayDiary(user.getUserId());
        if (todayDiaryOpt.isEmpty()) {
            return new MovieListResponse(List.of(), Map.of(), List.of(),false);
        }

        List<MoodDetail> currentMoods = diaryMoodService.getMoodDetails(todayDiaryOpt.get().getDiaryId());

        if (currentMoods.isEmpty()) {
//            return recommendByInitial(user);
            return new MovieListResponse(List.of(), Map.of(), List.of(),false);
        }

        MovieListResponse response = runRecommendLogic(user, currentMoods);

        moodCacheService.updateCachedMoods(user.getUserId(), currentMoods);

        return response;
    }
    /**
     * 두 감정 리스트가 동일한지 확인 (감정 타입과 비율까지 비교)
     */
    public boolean moodsAreSame(List<MoodDetail> list1, List<MoodDetail> list2) {
        if (list1 == null || list2 == null) return false;
        if (list1.size() != list2.size()) return false;

        log.info("감정리스트1 : {}", list1);
        log.info("감정리스트2 : {}", list2);

        Map<String, Integer> map1 = list1.stream()
                .collect(Collectors.toMap(MoodDetail::getMoodType, MoodDetail::getPercentage));
        Map<String, Integer> map2 = list2.stream()
                .collect(Collectors.toMap(MoodDetail::getMoodType, MoodDetail::getPercentage));

        return map1.equals(map2);
    }

    /**
     * 추천 로직의 핵심 메서드
     * - 감정별 장르 가중치 계산
     * - 장르별 영화 캐시 조회
     * - 사용자가 싫어하는 영화 필터링
     * - 장르별 추천 쿼터에 따라 영화 추천
     * - 추천 결과의 세부 정보 채우기
     * - 감정별 추천 결과 생성
     */
    private MovieListResponse runRecommendLogic(UserEntity user, List<MoodDetail> moodDetails) {

        Map<Integer, Double> genreScores = calculateGenreScores(moodDetails);

        List<Integer> sortedGenres = sortGenresByScoreDesc(genreScores);

        Map<Integer, List<MovieDto>> genreMovieCache = cacheMoviesByGenres(sortedGenres);

        List<Integer> dislikedMovieKeys = fetchDislikedMovieKeys(user);

        List<MovieDto> combinedResults = recommendTopMovies(sortedGenres, genreMovieCache, dislikedMovieKeys);

        fillMovieDetails(combinedResults);

        Map<String, List<MovieDto>> emotionBasedResults = buildEmotionBasedRecommendations(moodDetails, dislikedMovieKeys, genreMovieCache);

        List<MoodDetailDTO> moodDetailDTOs = moodDetails.stream()
                .map(MoodDetailDTO::fromEntity)
                .toList();

        return new MovieListResponse(combinedResults, emotionBasedResults, moodDetailDTOs, false);
    }

    /**
     * 감정별로 매핑된 장르에 가중치와 감정 비율을 곱해서 장르별 점수 누적 계산
     */
    private Map<Integer, Double> calculateGenreScores(List<MoodDetail> moodDetails) {
        Map<Integer, Double> genreScores = new HashMap<>();

        for (MoodDetail mood : moodDetails) {
            List<EmotionGenreMapEntity> mappings = emotionGenreMapRepository.findByEmotionTypeOrdered(mood.getMoodType());
            for (EmotionGenreMapEntity mapping : mappings) {
                genreScores.merge(
                        mapping.getGenreCode(),
                        mapping.getGenreWeight() * mood.getPercentage(),
                        Double::sum
                );
            }
        }
        return genreScores;
    }

    /**
     * 장르별 점수를 내림차순 정렬하여 장르 리스트 반환
     */
    private List<Integer> sortGenresByScoreDesc(Map<Integer, Double> genreScores) {
        return genreScores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();
    }

    /**
     * 장르 리스트별로 영화 리스트를 API 호출 후 캐싱
     */
    private Map<Integer, List<MovieDto>> cacheMoviesByGenres(List<Integer> genres) {
        Map<Integer, List<MovieDto>> cache = new HashMap<>();
        for (Integer genre : genres) {
            cache.put(genre, tmdbApiClientService.searchMoviesByGenre(genre));
        }
        return cache;
    }

    /**
     * 사용자별 싫어하는 영화 키 리스트 조회
     */
    private List<Integer> fetchDislikedMovieKeys(UserEntity user) {
        return disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream().map(DisLikeMoviesEntity::getMovieKey).toList();
    }

    /**
     * 상위 3개 장르에 대해 사전에 정의한 쿼터별로 영화 추천
     * 싫어하는 영화 및 중복 제거 처리
     * 쿼터 부족 시 상위 장르에서 추가 보충
     */
    private List<MovieDto> recommendTopMovies(List<Integer> topGenres,
                                              Map<Integer, List<MovieDto>> genreMovieCache,
                                              List<Integer> dislikedMovieKeys) {
        Set<Integer> usedMovieIds = new HashSet<>();
        List<MovieDto> combinedResults = new ArrayList<>();

        Map<Integer, Integer> genreQuotaMap = new HashMap<>();
        if (!topGenres.isEmpty()) genreQuotaMap.put(topGenres.get(0), PRIMARY_GENRE_RECOMMEND_COUNT);
        if (topGenres.size() > 1) genreQuotaMap.put(topGenres.get(1), SECONDARY_GENRE_RECOMMEND_COUNT);
        if (topGenres.size() > 2) genreQuotaMap.put(topGenres.get(2), TERTIARY_GENRE_RECOMMEND_COUNT);

        for (Integer genreCode : topGenres.stream().limit(3).toList()) {
            int quota = genreQuotaMap.getOrDefault(genreCode, 0);
            if (quota <= 0) continue;

            List<MovieDto> candidates = genreMovieCache.getOrDefault(genreCode, List.of());
            for (MovieDto movie : candidates) {
                if (combinedResults.size() >= TOTAL_RECOMMENDATION_COUNT) break;
                if (!dislikedMovieKeys.contains(movie.getMovieKey()) && !movie.isAdult() && usedMovieIds.add(movie.getMovieKey())) {
                    movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getMovieKey())));
                    combinedResults.add(movie);
                    if (--quota <= 0) break;
                }
            }
        }

        for (Integer genreCode : topGenres) {
            if (combinedResults.size() >= TOTAL_RECOMMENDATION_COUNT) break;
            List<MovieDto> candidates = genreMovieCache.getOrDefault(genreCode, List.of());
            for (MovieDto movie : candidates) {
                if (combinedResults.size() >= TOTAL_RECOMMENDATION_COUNT) break;
                if (!dislikedMovieKeys.contains(movie.getMovieKey()) && usedMovieIds.add(movie.getMovieKey())) {
                    combinedResults.add(movie);
                }
            }
        }
        return combinedResults;
    }

    /**
     * 영화 리스트에 대해 상세 정보(출연진, 감독, 트레일러 URL 등) 추가 호출 및 세팅
     */
    private void fillMovieDetails(List<MovieDto> movies) {
        movies.forEach(movie -> {
            String movieKey = movie.getMovieKey().toString();
            MovieDto detailed = tmdbApiClientService.getMovieCreditsWithDetails(movieKey);
            movie.setCastNames(detailed.getCastNames());
            movie.setDirectorName(detailed.getDirectorName());
            if (movie.getTrailerUrl() == null || movie.getTrailerUrl().isEmpty()) {
                movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(movieKey));
            }
        });
    }

    /**
     * 각 감정별로 별도 영화 추천 생성
     * - 감정별 추천 영화 수 계산
     * - 감정별 장르 점수 계산
     * - 감정별 장르 쿼터 할당
     * - 싫어하는 영화 필터링 및 중복 제거
     * - 상세 정보 채우기
     */
    private Map<String, List<MovieDto>> buildEmotionBasedRecommendations(List<MoodDetail> moodDetails,
                                                                         List<Integer> dislikedMovieKeys,
                                                                         Map<Integer, List<MovieDto>> genreMovieCache) {

        Map<String, List<MovieDto>> resultsByEmotion = new LinkedHashMap<>();

        Map<String, Integer> emotionRecommendationMap = new HashMap<>();
        for (MoodDetail mood : moodDetails) {
            emotionRecommendationMap.put(mood.getMoodType(), TOTAL_RECOMMENDATION_COUNT);
        }

        for (MoodDetail mood : moodDetails) {
            String emotion = mood.getMoodType();
            int emotionMovieCount = emotionRecommendationMap.getOrDefault(emotion, 0);

            Map<Integer, Double> genreScoresByEmotion = calculateGenreScoresForEmotion(mood);

            List<Integer> topGenresByEmotion = genreScoresByEmotion.entrySet().stream()
                    .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                    .map(Map.Entry::getKey)
                    .limit(3)
                    .toList();

            Map<Integer, Integer> genreQuota = allocateGenreQuota(emotionMovieCount, topGenresByEmotion);

            Set<Integer> usedMovieIds = new HashSet<>();
            List<MovieDto> emotionResults = new ArrayList<>();

            for (Integer genreCode : topGenresByEmotion) {
                int quota = genreQuota.getOrDefault(genreCode, 0);
                if (quota <= 0) continue;

                List<MovieDto> candidates = genreMovieCache.getOrDefault(genreCode, List.of());
                for (MovieDto movie : candidates) {
                    if (emotionResults.size() >= emotionMovieCount) break;
                    if (!dislikedMovieKeys.contains(movie.getMovieKey()) && !movie.isAdult() && usedMovieIds.add(movie.getMovieKey())) {
                        emotionResults.add(movie);
                        if (--quota <= 0) break;
                    }
                }
            }

            fillMovieDetails(emotionResults);
            resultsByEmotion.put(emotion, emotionResults);
        }

        return resultsByEmotion;
    }

    /**
     * 특정 감정 단위로 감정-장르 맵에서 가중치에 감정 비율 곱해 장르 점수 계산
     */
    private Map<Integer, Double> calculateGenreScoresForEmotion(MoodDetail mood) {
        Map<Integer, Double> genreScores = new HashMap<>();
        List<EmotionGenreMapEntity> mappings = emotionGenreMapRepository.findByEmotionTypeOrdered(mood.getMoodType());

        for (EmotionGenreMapEntity mapping : mappings) {
            genreScores.put(mapping.getGenreCode(), mapping.getGenreWeight() * mood.getPercentage());
        }

        return genreScores;
    }

    /**
     * 감정별 추천 개수를 감정별 장르 개수에 균등 분배
     * (나머지는 앞쪽 장르에 1개씩 추가 분배)
     */
    private Map<Integer, Integer> allocateGenreQuota(int total, List<Integer> genres) {
        Map<Integer, Integer> quotaMap = new HashMap<>();
        int size = genres.size();
        if (size == 0) return quotaMap;

        int base = total / size;
        int remainder = total % size;

        for (int i = 0; i < size; i++) {
            int count = base + (i < remainder ? 1 : 0);
            quotaMap.put(genres.get(i), count);
        }
        return quotaMap;
    }
}