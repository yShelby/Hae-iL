<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/dto/MoodDetailDTO.java
package com.haeildiary.www.emotion.dto;
========
package com.haeildairy.www.emotion.dto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/dto/MoodDetailDTO.java

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
