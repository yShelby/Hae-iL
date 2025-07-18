package com.haeildiary.www.dashboard.controller;

import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.dashboard.dto.DashboardStatsResponseDto;
import com.haeildiary.www.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponseDto> getDashboardStats(
            @AuthenticationPrincipal CustomUser customUser) {
        Integer userId = customUser.getUserId();

        DashboardStatsResponseDto stats = dashboardService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
}
