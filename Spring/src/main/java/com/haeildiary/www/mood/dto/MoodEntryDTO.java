package com.haeildiary.www.mood.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoodEntryDTO {
    private Long diaryId;
    private Integer moodScore;
}