// 📄 파일 경로: com.heaildairy.www.auth.SecurityConfig.java
// 📌 역할:
//   - 🔐 Spring Security의 인증 및 인가 설정을 담당
//   - 🛡️ JWT 인증 필터 추가 및 로그아웃 처리 설정
//   - 🚫 CSRF 비활성화, 세션 관리 (필요 시 세션 생성) 및 JWT 인증 필터 추가
//       * 비활성화 대신 (필요 시 세선 생성)으로 변경하여 IF_REQUIRED 를 반영
//   - 📊 API 경로 인증 처리, 나머지 경로는 자유롭게 설정
//
// 📊 데이터 흐름도:
// 1️⃣ PasswordEncoder와 AuthenticationManager 설정
// 2️⃣ `filterChain()`에서 Security 설정:
//    - CSRF 비활성화
//    - 세션 관리: 필요 시 세션 생성 (Thymeleaf 뷰 사용)
//    - JWT 인증 필터 등록
//    - API 요청에 대해 인증 처리, 그 외 경로는 모두 허용
// 3️⃣ 로그아웃 설정:
//    - 로그아웃 시 JWT 쿠키 삭제
//    - CustomLogoutHandler를 통해 로그아웃 처리
// 4️⃣ 인증 예외 처리: 인증 실패 시 /need-login 페이지로 리다이렉트
//     * 401 Unauthorized 응답 반환 대신 need-login 페이지로 리다이렉트로 변경하여
//        실제 동작을 반영

<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/SecurityConfig.java
package com.haeildiary.www.auth;

import com.haeildiary.www.auth.jwt.CustomLogoutHandler;
import com.haeildiary.www.auth.jwt.JwtAuthenticationFilter;
========
package com.haeildairy.www.auth;

import com.haeildairy.www.auth.jwt.CustomLogoutHandler;
import com.haeildairy.www.auth.jwt.JwtAuthenticationFilter;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/SecurityConfig.java
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration; // 추가
import org.springframework.web.cors.CorsConfigurationSource; // 추가
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // 추가

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    // JwtAuthenticationFilter 등록
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomLogoutHandler customLogoutHandler; // [리팩토링] CustomLogoutHandler 주입

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 인증 요청 처리 interface
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 개발단계이므로 csrf 보안기능 off
            http.csrf(AbstractHttpConfigurer::disable);

        // 세션 데이터 설정
        http.sessionManagement((session) -> session
//                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션 데이터 생성 방지
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // 필요할 때만 세션 생성
//                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // 세션 데이터 생성 허용
        );

        // 🔑 JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);


        // 로그인 여부 확인 설정
        http.authorizeHttpRequests((authorize)-> authorize
//               .requestMatchers("/**").permitAll() // 항상 허용
                .requestMatchers("/", "/login/jwt","/need-login", "/register", "/register/newUser",
                        "/reissue", "/find-email", "/find-email/verify", "/find-password", "/find-password/send", "/find-password/login",
                        "/api/s3/profile-presigned-url", "/diary", "/diary/**",
                        "/api/dashboard", "/api/dashboard/**", "/calendar", "/calendar/**" // dashboard, calendar 접근 권한 추가
                ).permitAll() // 인증 불필요 경로
                .requestMatchers("/api/calendar/**").authenticated() // 캘린더 API는 인증 필요
                .anyRequest().authenticated() // 나머지 모든 요청은 반드시 인증 필요
        );

        // 인증되지 않은 사용자가 보호된 경로에 접근 시 예외처리 : 메인 페이지로 리다이렉트
        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendRedirect("/need-login");
                })
        );

        // 로그아웃 DSL
        http.logout(logout -> logout
                        .logoutUrl("/logout") // 로그아웃 URL
                        .logoutSuccessUrl("/") // 로그아웃 성공 시 이동할 URL
                        // [리팩토링] CustomLogoutHandler를 로그아웃 핸들러로 등록
                        .addLogoutHandler(customLogoutHandler)
                        .deleteCookies("jwt", "refreshToken") // [추가] 로그아웃 시 쿠키 삭제
                );

        return http.build();  // 최종적으로 Security 설정을 빌드하여 반환
    }

    

    // CORS 설정 Bean 추가
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*"); // 모든 출처 허용 (개발 단계에서만 사용)
        configuration.addAllowedMethod("*"); // 모든 HTTP 메소드 허용
        configuration.addAllowedHeader("*"); // 모든 헤더 허용
        configuration.setAllowCredentials(true); // 자격 증명(쿠키, 인증 헤더 등) 허용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
        return source;
    }

    // WebSecurityCustomizer 빈 추가: 정적 리소스 경로를 Spring Security 필터 체인에서 완전히 제외
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/css/**", "/js/**", "/image/**");
    }

}

