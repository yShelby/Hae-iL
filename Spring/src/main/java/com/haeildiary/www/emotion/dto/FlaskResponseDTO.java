package com.haeildiary.www.emotion.dto;

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

    private String sentiment;

    private List<FlaskEmotionDetailDTO> details;

    private List<String> tags;

    @JsonProperty("custom_tags")
    private List<String> customTags;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlaskEmotionDetailDTO {
        @JsonProperty("emotion_type")
        private String emotionType;

        private Double percentage;
    }
}