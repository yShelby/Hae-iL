package com.haeildiary.www.dashboard.wordcloud.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WordCloudDto {
    private String text;
    private int value;
    private String sentiment;
}
