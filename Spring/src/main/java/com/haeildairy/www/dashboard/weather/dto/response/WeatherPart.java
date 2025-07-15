package com.heaildairy.www.dashboard.weather.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherPart {
    private String main;
    private String description;
    private String icon;
}
