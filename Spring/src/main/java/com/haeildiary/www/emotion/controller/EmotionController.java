package com.haeildiary.www.emotion.controller;


import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.emotion.dto.FlaskResponseDTO;
import com.haeildiary.www.emotion.service.AllService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/analyze")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // accessing different ports(5173 vs 8080)
public class EmotionController {

    private final AllService allService;
    /**
     * 일기 ID로 감정 분석 결과 조회
     * @param diaryId 일기 ID
     * @param customUser 인증된 사용자 정보
     * @return 감정 분석 결과 DTO
     */
    @GetMapping("/{diaryId}")
    public ResponseEntity<FlaskResponseDTO> getEmotionByDiaryId(
            @PathVariable Long diaryId,
            @AuthenticationPrincipal CustomUser customUser) {

        FlaskResponseDTO result = allService.findByDiary(diaryId);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result);
    }
}
