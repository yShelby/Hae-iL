package com.haeildiary.www.emotion.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class MoodDetailDTO {
    private Long detailId;
    private Integer percentage;
    private String emotionType;
    private Long diaryId;
    private BigDecimal confidenceScore;
}
