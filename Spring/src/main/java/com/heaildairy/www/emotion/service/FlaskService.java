package com.heaildairy.www.emotion.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.emotion.dto.FlaskResponseDTO;
import com.heaildairy.www.recommend.moviedto.MovieDTO;
import com.heaildairy.www.recommend.movieservice.RecommendMovieService;
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

    public FlaskResponseDTO callAnalyze(String text) {
        return webClient.post()
                .uri("/emotion")
                .header("Content-Type", "application/json")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(FlaskResponseDTO.class)
                .block();
    }

    public Map<String, List<MovieDTO>> analyzeAndRecommendByTop3Emotions(FlaskResponseDTO flaskResponseDTO, UserEntity user){
        Map<String, List<MovieDTO>> emotionToMovies = new LinkedHashMap<>();

        flaskResponseDTO.getDetails()
                .forEach(detail -> {
                    String emotionType = detail.getEmotionType();
                    List<MovieDTO> movies = recommendMovieService.recommendByEmotion(emotionType, user);
                    emotionToMovies.put(emotionType, movies != null ? movies : List.of());
                });
        return emotionToMovies;
    }
}