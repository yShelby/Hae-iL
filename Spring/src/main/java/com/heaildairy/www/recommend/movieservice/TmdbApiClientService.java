package com.heaildairy.www.recommend.movieservice;

import com.heaildairy.www.recommend.moviedto.MovieDTO;
import com.heaildairy.www.recommend.movieresponse.MovieListResponse;
import com.heaildairy.www.recommend.movieresponse.MovieTrailerResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * TMDB (The Movie Database) API를 호출하는 클라이언트 서비스
 * - WebClient를 이용해 TMDB의 다양한 영화 정보 API 호출 지원
 * - 영화 목록 조회, 상세 정보, 트레일러 영상 URL 가져오기 등을 담당
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TmdbApiClientService {

    private final WebClient webClient;

    // application.properties 또는 application.yml에 정의된 TMDB API 키를 주입받음
    @Value("${tmdb.api.key}")
    private String apiKey;

    // TMDB API 기본 URL (고정)
    private static final String BASE_URL = "https://api.themoviedb.org/3";

    /**
     * WebClient 빌더를 통해 baseUrl 설정 및 WebClient 생성
     * @param webClientBuilder WebClient.Builder 자동 주입
     */
    public TmdbApiClientService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(BASE_URL).build();
    }

    /**
     * 특정 장르 코드를 기준으로 TMDB에서 영화 리스트 검색
     * @param genreCode TMDB 장르 코드 (Integer)
     * @return Mono로 감싸진 영화 리스트 (MovieDTO List)
     */
    public Mono<List<MovieDTO>> searchMoviesByGenre(Integer genreCode) {
        log.debug("TMDB 영화 검색 요청 - 장르코드: {}", genreCode);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)           // 인증키
                        .queryParam("with_genres", genreCode)   // 장르 필터
                        .queryParam("language", "ko-KR")        // 한국어 응답
                        .build())
                .retrieve()
                .bodyToMono(MovieListResponse.class)            // TMDB API 응답 DTO로 변환
                .map(MovieListResponse::getResult)              // 결과 리스트만 추출
                .doOnNext(list -> log.debug("TMDB 검색 결과 영화 수: {}", list.size()));
    }

    /**
     * TMDB에서 특정 영화 상세 정보 조회
     * @param movieId 영화 ID (문자열)
     * @return Mono<MovieDTO> 단일 영화 정보
     */
    public Mono<MovieDTO> getMovieDetails(String movieId) {
        log.debug("TMDB 영화 상세 조회 요청 - movieId: {}", movieId);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{movieId}")
                        .queryParam("api_key", apiKey)
                        .build(movieId)
                )
                .retrieve()
                .bodyToMono(MovieDTO.class);
    }

    /**
     * TMDB에서 특정 영화의 트레일러 URL 조회
     * - YouTube에 올라온 'Trailer' 타입 비디오 중 첫 번째 결과를 사용
     * @param movieId 영화 ID
     * @return Mono<String> 트레일러 유튜브 임베드 URL (없으면 빈 Mono)
     */
    public Mono<String> getMovieTrailer(String movieId) {
        log.debug("TMDB 영화 트레일러 조회 요청 - movieId: {}", movieId);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{movieId}/videos")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "ko-KR")
                        .build(movieId))
                .retrieve()
                .bodyToMono(MovieTrailerResponse.class)
                .flatMap(response -> {
                    // TMDB가 반환하는 비디오 리스트에서 유튜브 트레일러만 필터링
                    return Mono.justOrEmpty(
                            response.getResults().stream()
                                    .filter(video -> "YouTube".equalsIgnoreCase(video.getSite())
                                            && "Trailer".equalsIgnoreCase(video.getType()))
                                    .findFirst()
                                    .map(video -> "https://www.youtube.com/embed/" + video.getKey())
                                    .orElse(null)
                    );
                });
    }
}
