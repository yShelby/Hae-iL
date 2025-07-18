package com.haeildiary.www.dashboard.fortune.controller;

import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.dashboard.fortune.dto.FortuneDto;
import com.haeildiary.www.dashboard.fortune.service.FortuneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard/fortune")
@RequiredArgsConstructor
public class FortuneController {

    private final FortuneService fortuneService;

    /**
     * [GET /api/dashboard/fortune]
     * 오늘의 포춘쿠키 상태를 확인하는 API
     * @param customUser 현재 로그인한 사용자의 정보 (Spring Security가 자동으로 주입)
     * @return 오늘의 포춘쿠키 상태
     */
    @GetMapping
    public ResponseEntity<FortuneDto.StatusResponse> getStatus(@AuthenticationPrincipal CustomUser customUser) {
        Integer currentUserId = customUser.getUserId();

        FortuneDto.StatusResponse status = fortuneService.getFortuneStatus(currentUserId);
        return ResponseEntity.ok(status);
    }

    /**
     * [POST /api/dashboard/fortune]
     * 사용자가 쿠키를 클릭했을 때, 운세를 뽑는 API
     * @param customUser 현재 로그인한 사용자의 정보 (Spring Security가 자동으로 주입)
     * @return 새로 뽑은 운세 메시지
     */
    @PostMapping
    public ResponseEntity<?> openCookie(@AuthenticationPrincipal CustomUser customUser) {
        Integer currentUserId = customUser.getUserId();

        try {
            FortuneDto.OpenResponse response = fortuneService.openFortuneCookie(currentUserId);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            // Service에서 "이미 쿠키를 열었다"는 예외가 발생했을 경우,
            // 409 Conflict 상태 코드를 응답하여 프론트엔드가 상황을 명확하게 인지하도록 합니다.
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
