<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/calendar/service/CalendarService.java
package com.haeildiary.www.calendar.service;

import com.haeildiary.www.calendar.dto.CalendarResponseDto;
import com.haeildiary.www.emotion.repository.MoodEntryRepository;
========
package com.haeildairy.www.calendar.service;

import com.haeildairy.www.calendar.dto.CalendarResponseDto;
import com.haeildairy.www.emotion.repository.MoodEntryRepository;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/calendar/service/CalendarService.java
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarService {

    private final MoodEntryRepository moodEntryRepository;

    public List<CalendarResponseDto> getCalendarEntries(Integer userId, int year, int month) {
        // 해당 월의 시작일과 마지막일 계산
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        // Repository를 통해 데이터 조회
        List<CalendarResponseDto> entries =
                moodEntryRepository.findDiariesWithMoodScoreByDateRange(userId, startDate, endDate);

        return entries;
    }
}
