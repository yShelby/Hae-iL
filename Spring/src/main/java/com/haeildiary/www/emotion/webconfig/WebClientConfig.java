<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/webconfig/WebClientConfig.java
package com.haeildiary.www.emotion.webconfig;
========
package com.haeildairy.www.emotion.webconfig;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/webconfig/WebClientConfig.java

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(){
        return WebClient.builder()
                .baseUrl("http://localhost:5000")
                .build();
    }
}
