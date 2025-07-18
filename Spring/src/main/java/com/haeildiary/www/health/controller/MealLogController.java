package com.haeildiary.www.health.controller;

import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.health.dto.MealLogDto;
import com.haeildiary.www.health.service.MealLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/meal")
@RequiredArgsConstructor
public class MealLogController {
    private final MealLogService mealLogService;

    /**
     * ➕ 식사 기록 저장
     */
    @PostMapping
    public ResponseEntity<MealLogDto.Response> saveMealLog(@AuthenticationPrincipal CustomUser customUser,
                                                           @Valid @RequestBody MealLogDto.SaveRequest dto) {
        MealLogDto.Response response = mealLogService.saveMealLog(customUser.getUserId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * ✏️ 식사 기록 수정
     */
    @PutMapping("/{mealId}")
    public ResponseEntity<MealLogDto.Response> updateMealLog(@PathVariable Long mealId,
                                                             @AuthenticationPrincipal CustomUser customUser,
                                                             @Valid @RequestBody MealLogDto.UpdateRequest dto) {
        MealLogDto.Response response = mealLogService.updateMealLog(mealId, customUser.getUserId(), dto);
        return ResponseEntity.ok(response);
    }

    /**
     * 🗑️ 식사 기록 삭제
     */
    @DeleteMapping("/{mealId}")
    public ResponseEntity<Void> deleteMealLog(@PathVariable Long mealId,
                                              @AuthenticationPrincipal CustomUser customUser) {
        mealLogService.deleteMealLog(mealId, customUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    /**
     * 🔍 날짜별 식사 기록 조회
     */
    @GetMapping
    public ResponseEntity<MealLogDto.Response> getMealLogByDate(@AuthenticationPrincipal CustomUser customUser,
                                                                @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        MealLogDto.Response response = mealLogService.findMealLogByDate(customUser.getUserId(), date);
        return ResponseEntity.ok(response);
    }

}
