package com.haeildiary.www.recommend.movie.movieservice;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.mood.dto.MoodDetailDto;
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

    /**
     * 감정 목록을 받아서 장르별 가중치 점수를 계산하는 메서드
     */
    public Map<Integer, Double> calculateGenreScores(List<MoodDetail> moodDetails) {
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
        return genreScores;
    }

    /**
     * 장르별 영화 리스트를 캐싱 조회
     */
    public Map<Integer, List<MovieDto>> getGenreMovieCache(List<Integer> topGenres) {
        Map<Integer, List<MovieDto>> genreMovieCache = new HashMap<>();
        for (Integer genreCode : topGenres) {
            genreMovieCache.put(genreCode, tmdbApiClientService.searchMoviesByGenre(genreCode));
        }
        return genreMovieCache;
    }

    /**
     * 오늘 일기 감정 기반 영화 추천 메인 메서드
     */
    public MovieListResponse recommendByTodayDiaryWeighted(UserEntity user) {
        Optional<DiaryEntity> todayDiaryOpt = diaryMoodService.getTodayDiary(user.getUserId());
        if (todayDiaryOpt.isEmpty()) return emptyResponse();

        List<MoodDetail> currentMoods = diaryMoodService.getMoodDetails(todayDiaryOpt.get().getDiaryId());
        if (currentMoods.isEmpty()) return emptyResponse();

        // 캐시된 감정과 비교하여 변경 없으면 추천 중단
        List<MoodDetail> cachedMoods = moodCacheService.getCachedMoods(user.getUserId());
        if (moodsAreSame(currentMoods, cachedMoods)) {
            log.info("감정 데이터가 변경되지 않아 추천 로직 중단");
            return MovieListResponse.noChange();
        }

        // 추천 로직 수행
        MovieListResponse response = runRecommendLogic(user, currentMoods);

        // 캐시 업데이트
        moodCacheService.updateCachedMoods(user.getUserId(), currentMoods);

        return response;
    }

    private MovieListResponse runRecommendLogic(UserEntity user, List<MoodDetail> moodDetails) {
        Map<Integer, Double> genreScores = calculateGenreScores(moodDetails);

        // 점수 높은 순서로 장르 정렬
        List<Integer> topGenres = genreScores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .toList();

        Map<Integer, List<MovieDto>> genreMovieCache = getGenreMovieCache(topGenres);

        List<Integer> dislikedMovieKeys = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream().map(DisLikeMoviesEntity::getMovieKey).toList();

        List<MovieDto> combinedResults = recommendMoviesByGenre(topGenres, genreMovieCache, dislikedMovieKeys);

        fillMovieDetails(combinedResults);

        Map<String, List<MovieDto>> resultsByEmotion = buildResultsByEmotion(moodDetails, dislikedMovieKeys, genreMovieCache);

        return new MovieListResponse(combinedResults, resultsByEmotion,
                moodDetails.stream().map(MoodDetailDto::fromEntity).toList(),
                false);
    }

    private List<MovieDto> recommendMoviesByGenre(List<Integer> topGenres, Map<Integer, List<MovieDto>> genreMovieCache, List<Integer> dislikedMovieKeys) {
        Set<Integer> usedMovieIds = new HashSet<>();
        List<MovieDto> combinedResults = new ArrayList<>();

        Map<Integer, Integer> genreCountMap = new HashMap<>();
        if (!topGenres.isEmpty()) genreCountMap.put(topGenres.get(0), 5);
        if (topGenres.size() > 1) genreCountMap.put(topGenres.get(1), 3);
        if (topGenres.size() > 2) genreCountMap.put(topGenres.get(2), 2);

        for (Integer genreCode : topGenres.stream().limit(3).toList()) {
            int count = genreCountMap.getOrDefault(genreCode, 0);
            if (count <= 0) continue;

            List<MovieDto> candidates = genreMovieCache.getOrDefault(genreCode, List.of());
            for (MovieDto movie : candidates) {
                if (combinedResults.size() >= 10) break;
                if (!dislikedMovieKeys.contains(movie.getMovieKey()) && usedMovieIds.add(movie.getMovieKey())) {
                    movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getMovieKey())));
                    combinedResults.add(movie);
                    if (--count <= 0) break;
                }
            }
        }

        // 부족할 경우 채우기
        for (Integer genreCode : topGenres) {
            if (combinedResults.size() >= 10) break;
            List<MovieDto> candidates = genreMovieCache.getOrDefault(genreCode, List.of());
            for (MovieDto movie : candidates) {
                if (combinedResults.size() >= 10) break;
                if (!dislikedMovieKeys.contains(movie.getMovieKey()) && usedMovieIds.add(movie.getMovieKey())) {
                    combinedResults.add(movie);
                }
            }
        }
        return combinedResults;
    }

    private void fillMovieDetails(List<MovieDto> movies) {
        movies.forEach(movie -> {
            String movieKey = movie.getMovieKey().toString();
            MovieDto movieDto = tmdbApiClientService.getMovieCreditsWithDetails(movieKey);
            movie.setCastNames(movieDto.getCastNames());
            movie.setDirectorName(movieDto.getDirectorName());
            String trailerUrl = tmdbApiClientService.getMovieTrailer(movieKey);
            movie.setTrailerUrl(trailerUrl);
        });
    }

    private Map<String, List<MovieDto>> buildResultsByEmotion(
            List<MoodDetail> moodDetails,
            List<Integer> dislikedMovieKeys,
            Map<Integer, List<MovieDto>> genreMovieCache) {

        Map<String, List<MovieDto>> resultsByEmotion = new LinkedHashMap<>();

        for (MoodDetail mood : moodDetails) {
            String emotion = mood.getEmotionType();
            double emotionPercentage = mood.getPercentage();

            Map<Integer, Double> genreScoresByEmotion = new HashMap<>();
            List<EmotionGenreMapEntity> mappings = emotionGenreMapRepository.findByEmotionTypeOrdered(emotion);
            for (EmotionGenreMapEntity mapping : mappings) {
                genreScoresByEmotion.put(mapping.getGenreCode(), mapping.getGenreWeight() * emotionPercentage);
            }

            List<Integer> sortedGenresByEmotion = genreScoresByEmotion.entrySet().stream()
                    .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                    .map(Map.Entry::getKey)
                    .toList();

            List<Integer> top3ByEmotion = sortedGenresByEmotion.stream().limit(3).toList();

            Map<Integer, Integer> moodCountMap = new HashMap<>();
            if (!top3ByEmotion.isEmpty()) moodCountMap.put(top3ByEmotion.get(0), 5);
            if (top3ByEmotion.size() > 1) moodCountMap.put(top3ByEmotion.get(1), 3);
            if (top3ByEmotion.size() > 2) moodCountMap.put(top3ByEmotion.get(2), 2);

            Set<Integer> emotionUsedMovieIds = new HashSet<>();
            List<MovieDto> emotionResults = new ArrayList<>();

            for (Integer genreCode : top3ByEmotion) {
                int count = moodCountMap.getOrDefault(genreCode, 0);
                if (count <= 0) continue;

                List<MovieDto> candidates = genreMovieCache.getOrDefault(genreCode, List.of());
                for (MovieDto movie : candidates) {
                    if (emotionResults.size() >= 10) break;
                    if (!dislikedMovieKeys.contains(movie.getMovieKey()) && emotionUsedMovieIds.add(movie.getMovieKey())) {
                        movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getMovieKey())));
                        emotionResults.add(movie);
                        if (--count <= 0) break;
                    }
                }
            }

            fillMovieDetails(emotionResults);

            resultsByEmotion.put(emotion, emotionResults);
        }

        return resultsByEmotion;
    }

    private MovieListResponse emptyResponse() {
        return new MovieListResponse(List.of(), Map.of(), List.of(), false);
    }

    private boolean moodsAreSame(List<MoodDetail> list1, List<MoodDetail> list2) {
        if (list1 == null || list2 == null) return false;
        if (list1.size() != list2.size()) return false;

        Map<String, Integer> map1 = list1.stream()
                .collect(Collectors.toMap(MoodDetail::getEmotionType, MoodDetail::getPercentage));
        Map<String, Integer> map2 = list2.stream()
                .collect(Collectors.toMap(MoodDetail::getEmotionType, MoodDetail::getPercentage));

        return map1.equals(map2);
    }
}
