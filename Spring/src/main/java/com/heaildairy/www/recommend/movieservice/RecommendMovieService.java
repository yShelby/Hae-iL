package com.heaildairy.www.recommend.movieservice;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.recommend.movieentity.EmotionGenreMapEntity;
import com.heaildairy.www.recommend.movierepository.DisLikeMoviesRepository;
import com.heaildairy.www.recommend.movierepository.EmotionGenreMapRepository;
import com.heaildairy.www.recommend.moviedto.MovieDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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
     * 감정 기반 영화 추천 메서드
     *
     * @param emotionType 감정 유형 (예: "기쁨", "슬픔")
     * @param user 현재 로그인한 사용자 정보
     * @return 추천 영화 리스트 (Mono 비동기 래핑)
     */
    public Mono<List<MovieDTO>> recommendByEmotion(String emotionType, UserEntity user) {
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
        List<Mono<List<MovieDTO>>> moviesByGenreMonos = new ArrayList<>();

        for (EmotionGenreMapEntity genreMap : genreWeights) {
            Integer genreCode = genreMap.getGenreCode();
            log.debug("장르 [{}]에 대한 영화 검색 시작", genreCode);

            // 장르별 영화 검색 후, 싫어요 리스트에 포함되지 않은 영화만 필터링
            Mono<List<MovieDTO>> moviesMono = tmdbApiClientService.searchMoviesByGenre(genreCode)
                    .map(list -> {
                        List<MovieDTO> filtered = list.stream()
                                .filter(movie -> !dislikedMovieKeys.contains(String.valueOf(movie.getId())))
                                .collect(Collectors.toList());
                        log.debug("장르 [{}] 필터링 후 남은 영화 수: {}", genreCode, filtered.size());
                        return filtered;
                    });

            moviesByGenreMonos.add(moviesMono);
        }

        // 4. 모든 장르의 추천 영화를 하나로 합침
        //    - 중복 영화 제거
        //    - 영화마다 트레일러 URL 조회 후 추가
        return Flux.concat(moviesByGenreMonos) // 여러 Mono<List<>>를 하나의 Flux<MovieDTO>로 변환
                .flatMap(Flux::fromIterable)
                .distinct(MovieDTO::getId) // 중복 영화 제거
                .flatMap(movie -> tmdbApiClientService.getMovieTrailer(String.valueOf(movie.getId()))
                        .map(trailerUrl -> {
                            movie.setTrailerUrl(trailerUrl); // 트레일러 URL 추가
                            return movie;
                        })
                        .defaultIfEmpty(movie)) // 트레일러 없을 경우 원본 유지
                .collectList() // Flux<MovieDTO> → Mono<List<MovieDTO>>
                .doOnNext(result -> log.info("최종 추천 영화 수: {}", result.size())); // 최종 추천 결과 개수 로그
    }
}
