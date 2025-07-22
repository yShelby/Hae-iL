package com.haeildiary.www.mood.service;

import com.haeildiary.www.mood.dto.FlaskResponseDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Slf4j
@Service
public class FlaskService {

    // 플라스크 서버와 통신하는 서비스
    private final WebClient webClient;

    public FlaskService(@Qualifier("flaskWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public FlaskResponseDTO callAnalyze(String text) {
        log.info("FlaskService callAnalyze: text={}", text);
        return webClient.post()
                .uri("/analyze")
                .header("Content-Type", "application/json")
                .bodyValue(Map.of("text", text))
                .retrieve()
                .bodyToMono(FlaskResponseDTO.class)
                .block();
    }

}