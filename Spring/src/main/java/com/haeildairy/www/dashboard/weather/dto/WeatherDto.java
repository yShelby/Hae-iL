package com.haeildairy.www.dashboard.weather.dto;

import lombok.Builder;
import lombok.Getter;

// 최종적으로 프론트엔드에 전달될 데이터 형식
@Getter
@Builder
public class WeatherDto {
    private String main; // 날씨 상태
    private String description; // 상세 설명
    private String icon;
    private Double temp;
}