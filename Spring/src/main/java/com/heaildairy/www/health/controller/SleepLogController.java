package com.heaildairy.www.health.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.health.dto.SleepLogDto;
import com.heaildairy.www.health.service.SleepLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 💤 SleepLogController.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 수면 기록 관련 API 요청 처리
 * - 인증 사용자 기준으로 수면 데이터 등록, 조회, 수정, 삭제 제공
 */

@RestController
@RequestMapping("/api/sleep")
@RequiredArgsConstructor
public class SleepLogController {

    private final SleepLogService sleepLogService;

    /**
     * ➕ 수면 기록 저장
     */
    @PostMapping
    public ResponseEntity<SleepLogDto.Response> saveSleepLog(
            @AuthenticationPrincipal CustomUser customUser,
            @Valid @RequestBody SleepLogDto.SaveRequest request
    ) {
        SleepLogDto.Response response = sleepLogService.saveSleepLog(customUser.getUserId(), request);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * ✏️ 수면 기록 수정
     */
    @PutMapping("/{sleepId}")
    public ResponseEntity<SleepLogDto.Response> updateSleepLog(
            @PathVariable Long sleepId,
            @AuthenticationPrincipal CustomUser customUser,
            @Valid @RequestBody SleepLogDto.UpdateRequest request
    ) {
        SleepLogDto.Response response = sleepLogService.updateSleepLog(sleepId, customUser.getUserId(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * 🗑️ 수면 기록 삭제
     */
    @DeleteMapping("/{sleepId}")
    public ResponseEntity<Void> deleteSleepLog(
            @PathVariable Long sleepId,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        sleepLogService.deleteSleepLog(sleepId, customUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    /**
     * 🔍 날짜별 수면 기록 조회
     */
    @GetMapping
    public ResponseEntity<SleepLogDto.Response> getSleepLogByDate(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        SleepLogDto.Response response = sleepLogService.findSleepLogByDate(customUser.getUserId(), date);
        return ResponseEntity.ok(response); // null이면 body: null 반환 (204 대신)
    }

    /**
     * 📅 월별 수면 기록 날짜 목록 조회
     */
    @GetMapping("/dates/{year}/{month}")
    public ResponseEntity<List<LocalDate>> getActiveSleepDates(
            @AuthenticationPrincipal CustomUser customUser,
            @PathVariable int year,
            @PathVariable int month
    ) {
        List<LocalDate> dates = sleepLogService.findActiveSleepDates(customUser.getUserId(), year, month);
        return ResponseEntity.ok(dates);
    }
}
