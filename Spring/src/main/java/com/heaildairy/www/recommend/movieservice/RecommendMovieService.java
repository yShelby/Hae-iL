package com.heaildairy.www.recommend.movieservice;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.recommend.movieentity.EmotionGenreMapEntity;
import com.heaildairy.www.recommend.movierepository.DisLikeMoviesRepository;
import com.heaildairy.www.recommend.movierepository.EmotionGenreMapRepository;
import com.heaildairy.www.recommend.moviedto.MovieDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    /**
     * 감정 기반 영화 추천 메서드 (동기 방식)
     *
     * @param emotionType 감정 유형 (예: "기쁨", "슬픔")
     * @param user 현재 로그인한 사용자 정보
     * @return 추천 영화 리스트
     */
    public List<MovieDTO> recommendByEmotion(String emotionType, UserEntity user) {
        log.info("영화 추천 요청 - 감정: {}, userId: {}", emotionType, user.getUserId());

        // 1. 감정에 매핑된 장르 가중치 리스트 조회 (ex: 기쁨 → 코미디, 음악 등)
        List<EmotionGenreMapEntity> genreWeights = emotionGenreMapRepository.findByEmotionTypeOrdered(emotionType);
        log.debug("조회된 장르 가중치: {}", genreWeights);

        // 2. 현재 사용자가 싫어요 표시한 영화 키 리스트 조회
        List<String> dislikedMovieKeys = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream()
                .map(entity -> entity.getMovieKey())
                .collect(Collectors.toList());
        log.debug("제외할 영화 키: {}", dislikedMovieKeys);

        // 3. 장르별로 TMDB API 호출 → 영화 검색 → 싫어요 영화 제거
        List<MovieDTO> combinedMovies = new ArrayList<>();

        for (EmotionGenreMapEntity genreMap : genreWeights) {
            Integer genreCode = genreMap.getGenreCode();
            log.debug("장르 [{}]에 대한 영화 검색 시작", genreCode);

            // TMDB API 동기 호출
            List<MovieDTO> movies = tmdbApiClientService.searchMoviesByGenre(genreCode);

            // 싫어요 영화 필터링
            List<MovieDTO> filtered = movies.stream()
                    .filter(movie -> !dislikedMovieKeys.contains(String.valueOf(movie.getId())))
                    .collect(Collectors.toList());

            log.debug("장르 [{}] 필터링 후 남은 영화 수: {}", genreCode, filtered.size());

            combinedMovies.addAll(filtered);
        }

        // 4. 중복 영화 제거
        Map<Integer, MovieDTO> distinctMovies = new LinkedHashMap<>();
        for (MovieDTO movie : combinedMovies) {
            distinctMovies.putIfAbsent(movie.getId(), movie);
        }

        // 5. 영화마다 트레일러 URL 조회 후 추가 (동기 호출)
        for (MovieDTO movie : distinctMovies.values()) {
            String trailerUrl = tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getId()));
            movie.setTrailerUrl(trailerUrl);
        }

        List<MovieDTO> result = new ArrayList<>(distinctMovies.values());
        log.info("최종 추천 영화 수: {}", result.size());

        return result;
    }
}