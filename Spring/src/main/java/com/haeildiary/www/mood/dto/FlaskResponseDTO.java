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

    private List<FlaskMoodDetailDTO> details;

    private List<String> tags;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlaskMoodDetailDTO {
        @JsonProperty("mood_type")
        private String moodType;
        private Integer percentage;
    }
}
