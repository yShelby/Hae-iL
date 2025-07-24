package com.haeildiary.www.dashboard.wordcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagCountDto {
    private String tagName;
    private Long count;
}
