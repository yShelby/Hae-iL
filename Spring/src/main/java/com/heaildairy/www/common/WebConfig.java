package com.heaildairy.www.core;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 🌐 WebConfig.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 스프링 MVC에서 CORS 설정을 담당하는 클래스
 * - 클라이언트(특히 프론트엔드)에서 오는 Cross-Origin 요청을 허용할 도메인과 메서드 정의
 *
 * 📊 데이터 흐름도
 * 1️⃣ application.properties (또는 yml)에서 허용할 출처(origin) 목록을 불러옴
 * 2️⃣ addCorsMappings 메서드가 호출되어, 특정 경로에 대해 CORS 정책 적용
 * 3️⃣ 클라이언트 요청이 올 때, 설정한 정책에 따라 허용 여부 판단 및 처리
 */

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 🔑 application.properties의 cors.allowed-origins 값 배열로 주입받음
    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;

    /**
     * 🛠️ CORS 매핑 설정
     * - "/api/**" 경로에 대해 CORS 정책을 적용함
     * - 허용 출처(origin), 허용 HTTP 메서드, 헤더, 쿠키 지원 등 설정
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")               // 1️⃣ API 경로 대상 지정
                .allowedOrigins(allowedOrigins)       // 2️⃣ 허용 출처 설정 (application.properties에서 로딩)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // 3️⃣ 허용 HTTP 메서드 설정
                .allowedHeaders("*")                  // 4️⃣ 모든 헤더 허용
                .allowCredentials(true)               // 5️⃣ 쿠키, 인증 정보 포함 허용
                .maxAge(3600);                        // 6️⃣ 프리플라이트 요청 캐시 시간(초)
    }
}
