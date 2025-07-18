package com.heaildairy.www.emotion.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.heaildairy.www.emotion.entity.MoodDetail;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@NoArgsConstructor
public class MoodDetailDto {
    private Long detailId;
    private Integer percentage;
    private String emotionType;
    private Long diaryId;

    public static MoodDetailDto fromEntity(MoodDetail moodDetail) {
        MoodDetailDto dto = new MoodDetailDto();
        dto.setEmotionType(moodDetail.getEmotionType());
        dto.setPercentage(moodDetail.getPercentage());
        return dto;
    }
}
