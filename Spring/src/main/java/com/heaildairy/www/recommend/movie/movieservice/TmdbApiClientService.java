package com.heaildairy.www.recommend.movie.movieservice;

import com.heaildairy.www.recommend.movie.moviedto.MovieDTO;
import com.heaildairy.www.recommend.movie.movieresponse.MovieListResponse;
import com.heaildairy.www.recommend.movie.movieresponse.MovieTrailerResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TmdbApiClientService {

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.themoviedb.org/3";

    public List<MovieDTO> searchMoviesByGenre(Integer genreCode) {
        log.debug("TMDB 영화 검색 요청 - 장르코드: {}", genreCode);

        String url = BASE_URL + "/discover/movie"
                + "?api_key=" + apiKey
                + "&with_genres=" + genreCode
                + "&language=ko-KR";

        MovieListResponse response = restTemplate.getForObject(url, MovieListResponse.class);

        List<MovieDTO> result = response != null ? response.getResult() : List.of();

        log.debug("TMDB 검색 결과 영화 수: {}", result.size());
        return result;
    }

    public MovieDTO getMovieDetails(String movieId) {
        log.debug("TMDB 영화 상세 조회 요청 - movieId: {}", movieId);

        String url = BASE_URL + "/movie/" + movieId + "?api_key=" + apiKey;

        return restTemplate.getForObject(url, MovieDTO.class);
    }

    public String getMovieTrailer(String movieId) {
        log.debug("TMDB 영화 트레일러 조회 요청 - movieId: {}", movieId);

        String url = BASE_URL + "/movie/" + movieId + "/videos"
                + "?api_key=" + apiKey
                + "&language=ko-KR";

        MovieTrailerResponse response = restTemplate.getForObject(url, MovieTrailerResponse.class);

        if (response != null && response.getResults() != null) {
            return response.getResults().stream()
                    .filter(video -> "YouTube".equalsIgnoreCase(video.getSite())
                            && "Trailer".equalsIgnoreCase(video.getType()))
                    .findFirst()
                    .map(video -> "https://www.youtube.com/embed/" + video.getKey())
                    .orElse(null);
        }

        return null;
    }
}
