package com.heaildairy.www.emotion.webconfig;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;

@Configuration
public class WebClientConfig {

    // TMDB WebClient
    @Value("${tmdb.base-url}")
    private String tmdbBaseUrl;

    @Bean
    @Qualifier("tmdbWebClient")
    public WebClient tmdbWebClient() {
        return WebClient.builder()
                .baseUrl(tmdbBaseUrl)
                .defaultHeader(HttpHeaders.ACCEPT_CHARSET, StandardCharsets.UTF_8.name())
                .build();
    }

    // Flask WebClient
    @Value("${flask.base-url}")
    private String flaskBaseUrl;

    @Bean
    @Qualifier("flaskWebClient")
    public WebClient flaskWebClient() {
        return WebClient.builder()
                .baseUrl(flaskBaseUrl)
                .defaultHeader(HttpHeaders.ACCEPT_CHARSET, StandardCharsets.UTF_8.name())
                .build();
    }
}

//    @Bean
//    public WebClient webClient(){
//        return WebClient.builder()
//                .baseUrl("http://localhost:5000")
//                .build();
//    }
//
//    @Bean
//    public RestTemplate restTemplate() {
//        return new RestTemplate();
//    }
//
//    @Value("${tmdb.base-url}") // application.yml 또는 properties에서 주입
//    private String tmdbBaseUrl;
//
//    @Bean
//    public WebClient tmdbWebClient() {
//        return WebClient.builder()
//                .baseUrl(tmdbBaseUrl)
//                .build();
//    }
//}
