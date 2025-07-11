package com.heaildairy.www.dashboard.weather.service;

import com.heaildairy.www.dashboard.weather.dto.WeatherDto;
import com.heaildairy.www.dashboard.weather.dto.response.WeatherResponseDto;
import com.heaildairy.www.dashboard.weather.dto.response.naver.ReverseGeocodeResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String openWeatherApiKey;

    @Value("${weather.api.url}")
    private String openWeatherApiUrl;

    @Value("${naver.api.client-id}")
    private String naverApiClientId;

    @Value("${naver.api.client-secret}")
    private String naverApiClientSecret;

    @Value("${naver.api.reverse-geocoding-url}")
    private String reverseGeocodeApiUrl;

    public WeatherDto getWeather(String lat, String lon) {
        RestTemplate restTemplate = new RestTemplate();

        // --- ⚙️ 1. 리버스 지오코딩으로 상세 주소 가져오기 ---
        String detailedAddress = getDetailedAddressFromNaver(lat, lon, restTemplate);

        // --- 🌦️ 2. OpenWeatherMap으로 날씨 정보 가져오기 ---
        String weatherUrl = String.format("%s?lat=%s&lon=%s&appid=%s&units=metric&lang=kr", openWeatherApiUrl, lat, lon, openWeatherApiKey);
        WeatherResponseDto weatherResponse = restTemplate.getForObject(weatherUrl, WeatherResponseDto.class);

        if (weatherResponse == null) {
            return null;
        }

        // --- ✨ 3. 두 정보 조합하여 최종 DTO 생성 ---
        // return response != null ? response.weatherDto(): null; // 🗑️ 이전 방식
        return weatherResponse.toWeatherDto(detailedAddress); // ✨ 수정된 방식: 변환 메서드에 주소 전달
    }

    /**
     * 네이버 리버스 지오코딩 API를 호출하여 좌표에 해당하는 상세 주소를 반환.
     * @param lat 위도
     * @param lon 경도
     * @param restTemplate API 호출을 위한 RestTemplate 객체
     * @return "시/도 시/군/구" 형식의 주소 문자열
     */
    private String getDetailedAddressFromNaver(String lat, String lon, RestTemplate restTemplate) {
        String coords = lon + "," + lat; // 네이버 API는 '경도,위도' 순서
        String url = String.format("%s?coords=%s&output=json", reverseGeocodeApiUrl, coords);

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-NCP-APIGW-API-KEY-ID", naverApiClientId);
        headers.set("X-NCP-APIGW-API-KEY", naverApiClientSecret);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // API 호출 및 응답 받기
            ResponseEntity<ReverseGeocodeResponseDto> response = restTemplate.exchange(url, HttpMethod.GET, entity, ReverseGeocodeResponseDto.class);
            if (response.getBody() != null) {
                return response.getBody().getDetailedAddress();
            }
        } catch (Exception e) {
            System.err.println("네이버 리버스 지오코딩 API 호출 실패: " + e.getMessage());
        }
        // API 호출 실패 시 기본값 반환
        return "위치 정보 없음";
    }
}

