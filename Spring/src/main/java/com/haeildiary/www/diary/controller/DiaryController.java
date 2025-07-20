<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/diary/controller/DiaryController.java
package com.haeildiary.www.diary.controller;

import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.diary.dto.DiaryDto;
import com.haeildiary.www.diary.service.DiaryService;
========
package com.haeildairy.www.diary.controller;

import com.haeildairy.www.auth.user.CustomUser;
import com.haeildairy.www.diary.dto.DiaryDto;
import com.haeildairy.www.diary.service.DiaryService;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/diary/controller/DiaryController.java
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 📒 DiaryController.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 일기 관련 API 요청 처리 (REST API 컨트롤러)
 * - 인증된 사용자(CustomUser) 기준으로 일기 CRUD 및 조회 기능 제공
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트가 HTTP 요청 시 해당 메서드 진입
 * 2️⃣ 인증 정보에서 CustomUser 추출(@AuthenticationPrincipal)
 * 3️⃣ 요청 데이터 유효성 검사 및 DTO 바인딩 (@Valid, @RequestBody, @RequestParam 등)
 * 4️⃣ 서비스 계층 DiaryService 호출하여 비즈니스 로직 처리
 * 5️⃣ 처리 결과를 HTTP 응답(ResponseEntity)으로 반환
 */

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    /**
     * ➕ 일기 저장
     * - 요청 바디(DiaryDto.SaveRequest)를 받아 새 일기 저장
     * - 인증된 사용자 ID를 서비스에 전달
     * - 성공 시 201 CREATED 상태와 저장된 일기 데이터 반환
     */
    @PostMapping
    public ResponseEntity<DiaryDto.Response> saveDiary(@AuthenticationPrincipal CustomUser customUser,
                                                       @Valid @RequestBody DiaryDto.SaveRequest dto) {
        DiaryDto.Response response = diaryService.saveDiary(customUser.getUserId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * ✏️ 일기 수정
     * - 경로 변수(diaryId)와 요청 바디(DiaryDto.UpdateRequest)를 받아 일기 수정
     * - 인증된 사용자 ID 검증 후 서비스 호출
     * - 성공 시 200 OK 상태와 수정된 일기 데이터 반환
     */
    @PutMapping("/{diaryId}")
    public ResponseEntity<DiaryDto.Response> updateDiary(@PathVariable Long diaryId,
                                                         @AuthenticationPrincipal CustomUser customUser,
                                                         @Valid @RequestBody DiaryDto.UpdateRequest dto) {
        DiaryDto.Response response = diaryService.updateDiary(diaryId, customUser.getUserId(), dto);
        return ResponseEntity.ok(response);
    }

    /**
     * 🗑 일기 삭제
     * - 경로 변수(diaryId)로 일기 식별, 인증된 사용자 ID와 함께 서비스 호출
     * - 성공 시 204 NO CONTENT 상태 반환 (응답 본문 없음)
     */
    @DeleteMapping("/{diaryId}")
    public ResponseEntity<Void> deleteDiary(@PathVariable Long diaryId,
                                            @AuthenticationPrincipal CustomUser customUser) {
        diaryService.deleteDiary(diaryId, customUser.getUserId());
        return ResponseEntity.noContent().build();
    }

    /**
     * 🔍 일기 ID로 조회
     * - 경로 변수(diaryId)로 일기 조회, 인증된 사용자 ID 검증 후 반환
     * - 성공 시 200 OK 상태와 일기 데이터 반환
     */
    @GetMapping("/{diaryId}")
    public ResponseEntity<DiaryDto.Response> getDiaryById(@PathVariable Long diaryId,
                                                          @AuthenticationPrincipal CustomUser customUser) {
        DiaryDto.Response response = diaryService.findDiaryById(diaryId, customUser.getUserId());
        return ResponseEntity.ok(response);
    }

    /**
     * 📅 특정 날짜 일기 조회
     * - 요청 파라미터(date)를 ISO 날짜 형식으로 받아 해당 날짜 일기 조회
     * - 인증된 사용자 ID와 날짜를 서비스에 전달
     * - 일기가 있으면 200 OK + 일기 반환, 없으면 204 NO CONTENT 반환
     */
    @GetMapping
    public ResponseEntity<DiaryDto.Response> getDiaryByDate(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        DiaryDto.Response response = diaryService.findDiaryByDate(customUser.getUserId(), date);

        // [핵심 수정] 204 No Content 대신, 데이터가 없으면 200 OK와 함께 null 본문을 반환합니다.
        // 이렇게 하면 프론트엔드 라이브러리가 이 응답을 '성공'으로 인지하여 불필요한 재시도를 하지 않습니다.
        return ResponseEntity.ok(response);
    }

    /**
     * 📅 특정 연도/월의 일기 작성된 날짜 리스트 조회
     * - 경로 변수(year, month)를 받아 해당 월에 작성된 일기 날짜 목록 조회
     * - 인증된 사용자 ID와 함께 서비스 호출 후 리스트 반환
     */
    @GetMapping("/dates/{year}/{month}")
    public ResponseEntity<List<LocalDate>> getActiveDates(@AuthenticationPrincipal CustomUser customUser,
                                                          @PathVariable int year,
                                                          @PathVariable int month) {
        List<LocalDate> activeDates = diaryService.findActiveDates(customUser.getUserId(), year, month);
        return ResponseEntity.ok(activeDates);
    }
}
