<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/weather/dto/WeatherDto.java
package com.haeildiary.www.dashboard.weather.dto;
========
package com.haeildairy.www.dashboard.weather.dto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/weather/dto/WeatherDto.java

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