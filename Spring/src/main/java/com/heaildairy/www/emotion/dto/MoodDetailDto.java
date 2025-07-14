package com.heaildairy.www.emotion.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MoodDetailDto {
    private Long detailId;
    private Integer percentage;
    private String emotionType;
    private Long diaryId;
}
