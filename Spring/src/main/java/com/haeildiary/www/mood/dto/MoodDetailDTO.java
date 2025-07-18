package com.haeildiary.www.mood.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MoodDetailDTO {
    private Long detailId;
    private Integer percentage;
    private String emotionType;
    private Long diaryId;
}
