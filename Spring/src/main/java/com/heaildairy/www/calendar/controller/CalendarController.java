package com.heaildairy.www.calendar.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.calendar.dto.CalendarResponseDto;
import com.heaildairy.www.calendar.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping
    public ResponseEntity<List<CalendarResponseDto>> getCalendarEntries(
            @AuthenticationPrincipal CustomUser customUser,
            @RequestParam int year,
            @RequestParam int month) {

        List<CalendarResponseDto> entries = calendarService.getCalendarEntries(customUser.getUserId(), year, month);

        return ResponseEntity.ok(entries);
    }
}
