<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/dto/FlaskResponseDTO.java
package com.haeildiary.www.emotion.dto;
========
package com.haeildairy.www.emotion.dto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/dto/FlaskResponseDTO.java

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
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