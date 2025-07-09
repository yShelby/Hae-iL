package com.example.testServer.emotion.controller;

import com.example.testServer.emotion.emotiondto.EmotionRequestDTD;
import com.example.testServer.emotion.emotiondto.FlaskResponseDTO;
import com.example.testServer.emotion.service.AllService;
import com.example.testServer.emotion.service.FlaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/emotion")
@RequiredArgsConstructor
public class EmotionController {

    private final FlaskService flaskService;
    private final AllService allService;

    @PostMapping("/diary")
    public ResponseEntity<?> analyzeAndSave(@RequestBody EmotionRequestDTD requestBody) {
        try {
            String text = (String) requestBody.getText();
            Integer diaryId = (Integer) requestBody.getDiaryId();

            if (text == null || text.isEmpty() || diaryId == null) {
                return ResponseEntity.badRequest().body("text와 diaryId는 필수입니다.");
            }

            FlaskResponseDTO flaskResult = flaskService.callAnalyze(requestBody.getText());
            log.info("Flask 서비스 응답 성공: {}",flaskResult);
            allService.allEmotion(flaskResult, requestBody.getDiaryId());

            return ResponseEntity.ok(flaskResult);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("서버 에러: " + e.getMessage());
        }
    }
}
