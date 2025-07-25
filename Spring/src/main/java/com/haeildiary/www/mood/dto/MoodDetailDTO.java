package com.haeildiary.www.mood.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.haeildiary.www.mood.entity.MoodDetail;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@NoArgsConstructor
public class MoodDetailDTO {
    private Long detailId;
    private Integer percentage;
    private String moodType;
    private Long diaryId;

    public static MoodDetailDTO fromEntity(MoodDetail moodDetail){
        MoodDetailDTO dto = new MoodDetailDTO();
        dto.setMoodType(moodDetail.getMoodType());
        dto.setPercentage(moodDetail.getPercentage());
        return dto;
    }

}
