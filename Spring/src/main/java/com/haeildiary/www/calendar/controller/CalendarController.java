<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/calendar/controller/CalendarController.java
package com.haeildiary.www.calendar.controller;

import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.calendar.dto.CalendarResponseDto;
import com.haeildiary.www.calendar.service.CalendarService;
========
package com.haeildairy.www.calendar.controller;

import com.haeildairy.www.auth.user.CustomUser;
import com.haeildairy.www.calendar.dto.CalendarResponseDto;
import com.haeildairy.www.calendar.service.CalendarService;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/calendar/controller/CalendarController.java
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
