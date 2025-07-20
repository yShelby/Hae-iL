<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/dto/TagDTO.java
package com.haeildiary.www.emotion.dto;
========
package com.haeildairy.www.emotion.dto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/dto/TagDTO.java

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
    private Long tagId;
    private String tagName;
    private Integer usedCount;
}
