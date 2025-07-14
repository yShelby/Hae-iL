package com.heaildairy.www.calendar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarResponseDto {
    private Long diaryId;
    private LocalDate diaryDate;
    private String title;
    private Integer moodScore;
}
