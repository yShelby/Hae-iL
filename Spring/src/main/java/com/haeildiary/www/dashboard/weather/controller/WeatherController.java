<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/weather/controller/WeatherController.java
package com.haeildiary.www.dashboard.weather.controller;

import com.haeildiary.www.dashboard.weather.dto.WeatherDto;
import com.haeildiary.www.dashboard.weather.service.WeatherService;
========
package com.haeildairy.www.dashboard.weather.controller;

import com.haeildairy.www.dashboard.weather.dto.WeatherDto;
import com.haeildairy.www.dashboard.weather.service.WeatherService;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/weather/controller/WeatherController.java
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/dashboard")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/weather")
    public ResponseEntity<WeatherDto> getCurrentWeather(
            @RequestParam("lat") String lat, // 요청 URL의 ?lat=... 값을 받는다
            @RequestParam("lon") String lon // 요청 URL의 ?lon=... 값을 받는다
    ) {
        // 서비스 로직을 호출하여 날씨 데이터를 가져온다.
        WeatherDto weatherData = weatherService.getWeather(lat, lon);

        // 데이터가 성공적으로 조회되면 200 OK 상태와 함께 데이터를 반환하고,
        // 그렇지 않으면 404 Not Found를 반환
        if (weatherData != null) {
            return ResponseEntity.ok(weatherData);
        }
        return ResponseEntity.notFound().build();
    }
}
