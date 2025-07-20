<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/weather/dto/response/WeatherPart.java
package com.haeildiary.www.dashboard.weather.dto.response;
========
package com.haeildairy.www.dashboard.weather.dto.response;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/weather/dto/response/WeatherPart.java

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
