package com.heaildairy.www.timeline.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.timeline.dto.TimelineDto;
import com.heaildairy.www.timeline.service.TimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timeline")
@RequiredArgsConstructor
public class TimelineController {

    private final TimelineService timelineService;

    // ✅ 단일 날짜용 (선택사항: 유지할 경우)
    @GetMapping(params = "date")
    public ResponseEntity<List<TimelineDto>> getTimelineByDate(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<TimelineDto> timeline = timelineService.getTimelineByDate(customUser.getUserId(), date);
        return ResponseEntity.ok(timeline);
    }

    // ✅ 날짜 범위 요청 대응 (프론트 타임라인 전용)
    @GetMapping
    public ResponseEntity<List<TimelineDto>> getTimelineByDateRange(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        List<TimelineDto> timeline = timelineService.getTimelineByDateRange(customUser.getUserId(), start, end);
        return ResponseEntity.ok(timeline);
    }
}
