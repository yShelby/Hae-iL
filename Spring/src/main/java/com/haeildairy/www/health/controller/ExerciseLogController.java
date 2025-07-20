package com.haeildairy.www.health.controller;

import com.haeildairy.www.auth.user.CustomUser;
import com.haeildairy.www.health.dto.ExerciseLogDto;
import com.haeildairy.www.health.service.ExerciseLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * 🏋️ ExerciseLogController.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 운동 기록 API 요청 처리
 * - 인증된 사용자 기반으로 CRUD 및 조회 기능 제공
 */
@RestController
@RequestMapping("/api/exercise")
@RequiredArgsConstructor
public class ExerciseLogController {

    private final ExerciseLogService exerciseLogService;

    /**
     * ➕ 운동 기록 저장
     */
    @PostMapping
    public ResponseEntity<ExerciseLogDto.Response> saveExerciseLog(@AuthenticationPrincipal CustomUser customUser,
                                                                   @Valid @RequestBody ExerciseLogDto.SaveRequest dto) {
        ExerciseLogDto.Response response = exerciseLogService.saveExerciseLog(customUser.getUserId(), dto);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * ✏️ 운동 기록 수정
     */
    @PutMapping("/{exerciseId}")
    public ResponseEntity<ExerciseLogDto.Response> updateExerciseLog(@PathVariable Long exerciseId,
                                                                     @AuthenticationPrincipal CustomUser customUser,
                                                                     @Valid @RequestBody ExerciseLogDto.UpdateRequest dto) {
        ExerciseLogDto.Response response = exerciseLogService.updateExerciseLog(exerciseId, customUser.getUserId(), dto);
        return ResponseEntity.ok(response);
    }

    /**
     * 🗑 운동 기록 삭제
     */
    @DeleteMapping("/{exerciseId}")
    public ResponseEntity<Void> deleteExerciseLog(@PathVariable Long exerciseId,
                                                  @AuthenticationPrincipal CustomUser customUser) {
        exerciseLogService.deleteExerciseLog(exerciseId, customUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    /**
     * 🔍 특정 날짜의 운동 기록 조회
     */
    @GetMapping
    public ResponseEntity<ExerciseLogDto.Response> getExerciseLogByDate(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        ExerciseLogDto.Response response = exerciseLogService.findExerciseLogByDate(customUser.getUserId(), date);
        return ResponseEntity.ok(response);
    }

}
