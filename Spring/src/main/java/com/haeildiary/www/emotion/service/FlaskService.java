<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/service/FlaskService.java
package com.haeildiary.www.emotion.service;

import com.haeildiary.www.emotion.dto.FlaskResponseDTO;
========
package com.haeildairy.www.emotion.service;

import com.haeildairy.www.emotion.dto.FlaskResponseDTO;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/service/FlaskService.java
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