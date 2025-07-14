package com.heaildairy.www.emotion.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.emotion.dto.FlaskResponseDTO;
import com.heaildairy.www.recommend.moviedto.MovieDTO;
import com.heaildairy.www.recommend.movieservice.RecommendMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

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

    public List<MovieDTO> analyzeAndRecommend(String text, UserEntity user){
        FlaskResponseDTO flaskResponseDTO = callAnalyze(text);

        String emotionType = flaskResponseDTO.getSentiment();

        return recommendMovieService.recommendByEmotion(emotionType, user)
                .block();
    }
}