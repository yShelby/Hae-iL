package com.haeildiary.www.dashboard.weather.service;

import com.haeildiary.www.dashboard.weather.dto.WeatherDto;
import com.haeildiary.www.dashboard.weather.dto.response.WeatherResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    public WeatherDto getWeather(String lat, String lon) {
        // RestTemplate을 사용하여 외부 api 호출
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format("%s?lat=%s&lon=%s&appid=%s&units=metric&lang=kr", apiUrl, lat, lon, apiKey);
        // 포맷팅 안됨, 그냥 문자열임
        // String url = "%s?lat=%s&lon=%s&appid=%s&units=metric&lang=kr\", apiUrl, lat, lon, apiKey);

        WeatherResponseDto response = restTemplate.getForObject(url, WeatherResponseDto.class);

        // DTO에 내장된 변환 메서드를 사용하여 서비스 로직을 간결하게 유지
        return response != null ? response.weatherDto() : null;
    }
}
