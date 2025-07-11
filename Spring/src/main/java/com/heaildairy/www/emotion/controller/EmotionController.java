package com.heaildairy.www.emotion.controller;


import com.heaildairy.www.emotion.dto.FlaskResponseDTO;
import com.heaildairy.www.emotion.service.AllService;
import com.heaildairy.www.emotion.service.FlaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/emotion")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // accessing different ports(5173 vs 8080)
public class EmotionController {

    private final FlaskService flaskService;
    private final AllService allService;

    @PostMapping("/diary")
    public ResponseEntity<?> analyzeAndSave(@RequestBody EmotionRequestDTO requestBody) {
        try {
            String text = (String) requestBody.getText();
            Long diaryId =  requestBody.getDiaryEntity().getDiaryId();

            if (text == null || text.isEmpty() || diaryId == null) {
                return ResponseEntity.badRequest().body("text와 diaryId는 필수입니다.");
            }

            FlaskResponseDTO flaskResult = flaskService.callAnalyze(requestBody.getText());
            log.info("Flask 서비스 응답 성공: {}",flaskResult);
            allService.allEmotion(flaskResult, requestBody.getDiaryEntity().getDiaryId());

            return ResponseEntity.ok(flaskResult);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("서버 에러: " + e.getMessage());
        }
    }
}
