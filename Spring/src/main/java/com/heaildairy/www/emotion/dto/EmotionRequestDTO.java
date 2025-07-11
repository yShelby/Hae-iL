package com.heaildairy.www.emotion.dto;

import com.heaildairy.www.diary.entity.DiaryEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmotionRequestDTO {
    private String text;
    private DiaryEntity diaryEntity;
}
