package com.haeildairy.www.calendar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
//@AllArgsConstructor
public class CalendarResponseDto {
    private Long diaryId;
    private LocalDate diaryDate;
    private String title;
    private Integer moodScore;

    public CalendarResponseDto(Long diaryId, LocalDate diaryDate, String title, Integer moodScore) {
        this.diaryId = diaryId;
        this.diaryDate = diaryDate;
        this.title = title;
        this.moodScore = moodScore;
    };
}
