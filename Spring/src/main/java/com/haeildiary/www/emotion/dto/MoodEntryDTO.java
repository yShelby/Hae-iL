<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/dto/MoodEntryDTO.java
package com.haeildiary.www.emotion.dto;
========
package com.haeildairy.www.emotion.dto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/dto/MoodEntryDTO.java

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoodEntryDTO {
    private Long diaryId;
    private Integer moodScore;
}