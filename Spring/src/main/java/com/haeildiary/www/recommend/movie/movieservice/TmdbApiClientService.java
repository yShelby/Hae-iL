package com.haeildiary.www.recommend.movie.movieservice;

import com.haeildiary.www.recommend.movie.moviedto.MovieDto;
import com.haeildiary.www.recommend.movie.movieresponse.KeywordResponse;
import com.haeildiary.www.recommend.movie.movieresponse.MovieCreditsResponse;
import com.haeildiary.www.recommend.movie.movieresponse.MovieTrailerResponse;
import com.haeildiary.www.recommend.movie.movieresponse.TmdbMovieResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.w3c.dom.ls.LSInput;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.regex.Pattern;
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
        List<String> bannedKeywords = List.of("softcore", "pink film", "adult", "sex", "lgbt", "lesbian", "gay");

        // 비동기 스트림을 block()으로 동기 변환해서 리턴
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/discover/movie")
                        .queryParam("api_key", apiKey)
                        .queryParam("with_genres", genreCode)
                        .queryParam("include_adult", "false")
                        .queryParam("language", "ko-KR")
                        .build())
                .retrieve()
                .bodyToMono(TmdbMovieResponse.class)
                .flatMapMany(response -> Flux.fromIterable(response.getResults()))
                .filter(movie -> !movie.isAdult())
                .flatMap(movie -> getKeywordsForMovieReactive(movie.getMovieKey())
                        .map(keywords -> {
                            boolean bannedFound = keywords.stream().anyMatch(keyword -> containsForbiddenKeyword(keyword, bannedKeywords));
                            return new MovieWithKeywords(movie, bannedFound);
                        }))
                .filter(mwk -> !mwk.bannedFound)
                .map(mwk -> mwk.movie)
                .collectList()
                .doOnNext(list -> log.debug("🎬 TMDB 검색 결과 영화 수: {}", list.size()))
                .block(); // 여기서 동기 호출
    }

    // 키워드도 Mono로 반환하는 메서드
    private Mono<List<String>> getKeywordsForMovieReactive(Integer movieId) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/" + movieId + "/keywords")
                        .queryParam("api_key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(KeywordResponse.class)
                .map(response -> response.getKeywords().stream()
                        .map(KeywordResponse.Keyword::getName)
                        .collect(Collectors.toList()));
    }

    // 내부 클래스 - 필터용
    private static class MovieWithKeywords {
        final MovieDto movie;
        final boolean bannedFound;

        MovieWithKeywords(MovieDto movie, boolean bannedFound) {
            this.movie = movie;
            this.bannedFound = bannedFound;
        }
    }

    private boolean containsForbiddenKeyword(String keyword, List<String> bannedKeywords) {
        return bannedKeywords.stream()
                .anyMatch(banned -> keyword.toLowerCase().matches(".*\\b"+ Pattern.quote(banned.toLowerCase()) + "\\b.*"));
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