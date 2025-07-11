package com.heaildairy.www.emotion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class MoodDetailDTO {
    private Integer detailId;
    private Integer percentage;
    private String emotionType;
    private Long diaryId;
    private BigDecimal confidenceScore;
}
