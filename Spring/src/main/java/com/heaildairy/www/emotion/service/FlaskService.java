package com.heaildairy.www.emotion.service;

import com.heaildairy.www.emotion.dto.FlaskResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FlaskService {

    // 플라스크 서버와 통신하는 서비스
    private final WebClient webClient;

    public FlaskResponseDTO callAnalyze(String text) {
        return webClient.post()
                .uri("/emotion")
                .header("Content-Type", "application/json")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(FlaskResponseDTO.class)
                .block();
    }
}