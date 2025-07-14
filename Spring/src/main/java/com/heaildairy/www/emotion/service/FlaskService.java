package com.heaildairy.www.emotion.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.emotion.dto.FlaskResponseDto;
import com.heaildairy.www.recommend.movie.moviedto.MovieDto;
import com.heaildairy.www.recommend.movie.movieservice.RecommendMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FlaskService {

    // 플라스크 서버와 통신하는 서비스
    private final WebClient webClient;
    private final RecommendMovieService recommendMovieService;

    public FlaskResponseDto callAnalyze(String text) {
        return webClient.post()
                .uri("/analyze")
                .header("Content-Type", "application/json")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(FlaskResponseDto.class)
                .block();
    }

    public Map<String, List<MovieDto>> analyzeAndRecommendByTop3Emotions(FlaskResponseDto flaskResponseDTO, UserEntity user){
        Map<String, List<MovieDto>> emotionToMovies = new LinkedHashMap<>();

        flaskResponseDTO.getDetails()
                .forEach(detail -> {
                    String emotionType = detail.getEmotionType();
                    List<MovieDto> movies = recommendMovieService.recommendByEmotion(emotionType, user);
                    emotionToMovies.put(emotionType, movies != null ? movies : List.of());
                });
        return emotionToMovies;
    }
}