<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/weather/dto/response/MainPart.java
package com.haeildiary.www.dashboard.weather.dto.response;
========
package com.haeildairy.www.dashboard.weather.dto.response;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/weather/dto/response/MainPart.java

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class MainPart {
    private Double temp;
}
