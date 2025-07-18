package com.haeildiary.www.mood.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlaskResponseDTO {
    @JsonProperty("mood_score")
    private Integer moodScore;

    private List<FlaskEmotionDetailDTO> details;

    private List<String> tags;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlaskEmotionDetailDTO {
        @JsonProperty("emotion_type")
        private String emotionType;
        private Integer percentage;
    }
}
