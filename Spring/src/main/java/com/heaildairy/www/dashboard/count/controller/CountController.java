package com.heaildairy.www.dashboard.count.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.dashboard.count.dto.CountStatsResponseDto;
import com.heaildairy.www.dashboard.count.service.CountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class CountController {

    private final CountService countService;

    @GetMapping("/stats")
    public ResponseEntity<CountStatsResponseDto> getDashboardStats(
            @AuthenticationPrincipal CustomUser customUser) {
        Integer userId = customUser.getUserId();

        CountStatsResponseDto stats = countService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
}
