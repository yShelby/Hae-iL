// 📄 파일 경로: com.heaildairy.www.common.WebConfig.java
// 📌 역할:
//   - 🌍 CORS(Cross-Origin Resource Sharing) 설정
//   - 🔁 React 기반 SPA의 라우팅 문제 해결 (새로고침 시에도 index.html 렌더링)
//
// 📊 데이터 흐름도:
// 1️⃣ 브라우저가 클라이언트에서 API 요청 (예: /api/diary)
//    → CORS 설정에 따라 허용된 origin만 요청 허용
// 2️⃣ 사용자가 주소창에 직접 SPA 경로 입력 (예: /diary/123)
//    → Spring이 해당 경로에 대한 컨트롤러가 없다고 판단
//    → ViewController가 요청을 "/" 경로(index.html)로 강제 포워딩
//    → React Router가 클라이언트 라우팅 처리

package com.haeildairy.www.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ✅ application.yml에 정의된 허용된 CORS origin 목록을 주입
    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;

    /**
     * 🌍 CORS(Cross-Origin Resource Sharing) 정책 설정
     * - 프론트엔드(React)와 백엔드(Spring)가 다른 포트/도메인에 있을 때 보안 정책 설정
     * - /api/** 경로에만 CORS 허용
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // ✅ API 경로에만 CORS 적용
                .allowedOrigins(allowedOrigins) // 허용 origin 설정 (ex. http://localhost:5173 등)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // 허용 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true) // 쿠키 포함 여부 허용
                .maxAge(3600); // 브라우저의 preflight 요청 캐시 시간 (1시간)
    }

    /**
     * 🔁 SPA(React) 라우팅을 위한 포워딩 설정
     * - SpaForwardingController의 역할을 이 메소드가 대체합니다.
     * - Spring이 처리할 수 없는 경로(정적 자원도 아님)는 모두 "/"로 포워딩
     * - React Router가 클라이언트 측 라우팅 처리
     * - 예: /diary/view/1 → 실제 존재하지 않는 URL → index.html 포워딩 → React가 처리
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 📌 정적 리소스(파일명에 . 포함) 및 /api/** 제외한 모든 경로를 "/"로 포워딩
        registry.addViewController("/{path:[^\\.]*}")         // /main, /about 같은 1단 경로
                .setViewName("forward:/");

        registry.addViewController("/**/{path:[^\\.]*}")      // /diary/view/1 같은 다단계 경로
                .setViewName("forward:/");
    }
}
