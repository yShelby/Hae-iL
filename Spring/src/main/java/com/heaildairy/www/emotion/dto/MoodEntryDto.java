package com.heaildairy.www.emotion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoodEntryDto {
    private Long diaryId;
    private Integer moodScore;
}