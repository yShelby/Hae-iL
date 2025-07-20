<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/weather/dto/response/WeatherResponseDto.java
package com.haeildiary.www.dashboard.weather.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.haeildiary.www.dashboard.weather.dto.WeatherDto;
========
package com.haeildairy.www.dashboard.weather.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.haeildairy.www.dashboard.weather.dto.WeatherDto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/weather/dto/response/WeatherResponseDto.java
import lombok.Getter;
import lombok.Setter;

import java.util.List;

// OpenWeatherMap API 응답의 전체 구조를 매핑하기 위한 DTO
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)

public class WeatherResponseDto {
    private List<WeatherPart> weather;
    private MainPart main;

    // 외부 API 응답 객체를 우리 시스템의 공식 DTO(`WeatherDto`)로 변환하는 헬퍼 메서드
    public WeatherDto weatherDto() {
        if (weather == null || weather.isEmpty() || main == null) {
            return null;
        }
        WeatherPart firstWeatherPart = weather.get(0);
        return WeatherDto.builder()
                .main(firstWeatherPart.getMain())
                .description(firstWeatherPart.getDescription())
                .icon(firstWeatherPart.getIcon())
                .temp(main.getTemp())
                .build();
    }
}
