package com.heaildairy.www.dashboard.weather.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.heaildairy.www.dashboard.weather.dto.WeatherDto;
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
    private String name;

    /**
     * 외부 API 응답 객체를 우리 시스템의 공식 DTO('WeatherDto')로 변환.
     * @param detailedCityName 리버스 지오코딩으로 얻은 상세 주소 (예: "서울 금천구")
     * @return 최종 WeatherDto 객체
     */
    public WeatherDto toWeatherDto(String detailedCityName) { // 상세 주소를 파라미터로 받도록 변경
        if (weather == null || weather.isEmpty() || main == null) {
            return null;
        }
        WeatherPart firstWeatherPart = weather.get(0);
        return WeatherDto.builder()
                .city(detailedCityName) // 1. 리버스 지오코딩으로 받은 상세 주소 사용
                .icon(firstWeatherPart.getIcon()) // 2. 아이콘 ID
                .main(firstWeatherPart.getMain()) // 3. 날씨 내용 (Clear, Clouds 등)
                .temp(main.getTemp()) // 4. 현재 온도
                .build();
    }
}
