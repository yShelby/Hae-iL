package com.haeildiary.www.record.controller;

import com.haeildiary.www.common.GetUserId;
import com.haeildiary.www.record.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api/record")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    /**
     * @param userId @GetUserId 어노테이션을 통해 SecurityContext에서 직접 주입받은 사용자 ID
     * @param year  조회할 연도
     * @param month 조회할 월
     * @return 해당 월에 저널 또는 일기가 작성된 날짜와 타입(journal/diary/both) 정보
     */
    @GetMapping("/date")
    public ResponseEntity<Map<Integer, String>> getRecordDates(
            @GetUserId Integer userId, // @GetUserId 어노테이션 사용으로 코드가 간결해짐
            @RequestParam("year") int year,
            @RequestParam("month") int month
    ) {
        // userId가 null일 경우 (비로그인 상태)에 대한 방어 로직 추가
        if (userId == null) {
            // 비로그인 사용자는 빈 데이터를 반환하도록 처리
            return ResponseEntity.ok(Map.of());
        }
        Map<Integer, String> dates = recordService.getRecordedDatesInMonth(userId, year, month);
        return ResponseEntity.ok(dates);
    }
}
