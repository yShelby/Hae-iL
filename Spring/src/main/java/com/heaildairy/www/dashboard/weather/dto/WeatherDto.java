package com.heaildairy.www.dashboard.weather.dto;

import lombok.Builder;
import lombok.Getter;

// 최종적으로 프론트엔드에 전달될 데이터 형식
@Getter
@Builder
public class WeatherDto {
    private String city;     // 1. 도시 (시/구/동)
    private String icon;     // 2. 날씨 아이콘 ID
    private String main;     // 3. 날씨 내용 (예: "Clear", "Clouds")
    private Double temp;     // 4. 현재 온도
}