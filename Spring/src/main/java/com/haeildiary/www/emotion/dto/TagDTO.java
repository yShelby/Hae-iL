package com.haeildiary.www.emotion.dto;

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
