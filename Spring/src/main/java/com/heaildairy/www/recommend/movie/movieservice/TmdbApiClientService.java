package com.heaildairy.www.recommend.movie.movieservice;

import com.heaildairy.www.recommend.movie.moviedto.MovieDto;
import com.heaildairy.www.recommend.movie.movieresponse.MovieCreditsResponse;
import com.heaildairy.www.recommend.movie.movieresponse.MovieListResponse;
import com.heaildairy.www.recommend.movie.movieresponse.MovieTrailerResponse;
import com.heaildairy.www.recommend.movie.movieresponse.TmdbMovieResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TmdbApiClientService {

    private final WebClient webClient;

    private final String apiKey;

    public TmdbApiClientService(@Qualifier("tmdbWebClient") WebClient webClient,
                                @Value("${tmdb.api.key}") String apiKey) {
        this.webClient = webClient;
        this.apiKey = apiKey;
    }

    public List<MovieDto> searchMoviesByGenre(Integer genreCode) {
        log.debug("🔍 TMDB 영화 검색 요청 - 장르코드: {}", genreCode);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("with_genres", genreCode)
                        .queryParam("language", "ko-KR")
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieResponse.class)
                .map(response -> {
                    List<MovieDto> results = response.getResults();
                    log.debug("🎬 TMDB 검색 결과 영화 수: {}", results.size());
                    return results;
                })
                .block(); // 필요 시 동기 호출 (Spring MVC에서 사용 시 block 필수)
    }

    public MovieDto getMovieCreditsWithDetails(String movieId) {
        MovieCreditsResponse creditsResponse = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + movieId + "/credits")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "ko-KR")
                        .build())
                .retrieve()
                .bodyToMono(MovieCreditsResponse.class)
                .block();

        MovieDto dto = new MovieDto();

        if (creditsResponse != null) {
            String director = creditsResponse.getCrew().stream()
                    .filter(c -> "Director".equalsIgnoreCase(c.getJob()))
                    .map(MovieCreditsResponse.Crew::getName)
                    .findFirst()
                    .orElse("");

            List<String> castNames = creditsResponse.getCast().stream()
                    .limit(10)
                    .map(MovieCreditsResponse.Cast::getName)
                    .collect(Collectors.toList());

            dto.setDirectorName(director);
            dto.setCastNames(castNames);
        }
        return dto;
    }

    public String getMovieTrailer(String movieId) {
        log.debug("🎞️ TMDB 영화 트레일러 조회 요청 - movieId: {}", movieId);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + movieId + "/videos")
                        .queryParam("api_key", apiKey)
                        .queryParam("language", "ko-KR")
                        .build())
                .retrieve()
                .bodyToMono(MovieTrailerResponse.class)
                .map(response -> {
                    if (response.getResults() == null) return "";

                    return response.getResults().stream()
                            .filter(video -> "YouTube".equalsIgnoreCase(video.getSite())
                                    && "Trailer".equalsIgnoreCase(video.getType()))
                            .findFirst()
                            .map(video -> "https://www.youtube.com/embed/" + video.getKey())
                            .orElse("");
                })
                .block();
    }
}
