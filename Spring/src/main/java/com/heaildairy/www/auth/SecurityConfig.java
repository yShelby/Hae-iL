// 📄 파일 경로: com.heaildairy.www.auth.SecurityConfig.java
// 📌 역할:
//   - 🔐 Spring Security의 인증 및 인가 설정을 담당
//   - 🛡️ JWT 인증 필터 추가 및 로그아웃 처리 설정
//   - 🚫 CSRF 비활성화, 세션 관리 비활성화 (JWT 사용 시 필요)
//   - 📊 API 경로 인증 처리, 나머지 경로는 자유롭게 설정
//
// 📊 데이터 흐름도:
// 1️⃣ PasswordEncoder와 AuthenticationManager 설정
// 2️⃣ `filterChain()`에서 Security 설정:
//    - CSRF 비활성화
//    - 세션 관리 비활성화 (Stateful → Stateless)
//    - JWT 인증 필터 등록
//    - API 요청에 대해 인증 처리, 그 외 경로는 모두 허용
// 3️⃣ 로그아웃 설정:
//    - 로그아웃 시 JWT 쿠키 삭제
//    - CustomLogoutHandler를 통해 로그아웃 처리
// 4️⃣ 인증 예외 처리: 인증 실패 시 401 Unauthorized 응답 반환

package com.heaildairy.www.auth;

import com.heaildairy.www.auth.jwt.CustomLogoutHandler;
import com.heaildairy.www.auth.jwt.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    // 🛡️ JWT 인증 필터와 로그아웃 핸들러 주입
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomLogoutHandler customLogoutHandler;

    // 🧰 PasswordEncoder (비밀번호 암호화) - BCrypt 알고리즘 사용
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔑 AuthenticationManager를 Bean으로 등록 (Spring Security 인증 처리)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 🛡️ SecurityFilterChain 설정: 인증 및 인가 규칙 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 🚫 CSRF 비활성화: JWT는 쿠키를 사용하므로 CSRF 필요 없음
                .csrf(AbstractHttpConfigurer::disable)

                // 🔄 세션 관리 비활성화: JWT 기반 Stateless 인증 방식 사용
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 🔑 JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // 🛠️ 인증 규칙 설정
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/**").authenticated() // API 경로만 인증 필요
                        .anyRequest().permitAll() // 그 외 모든 경로는 허용
                );

        // 🚪 로그아웃 설정
        http.logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "POST")) // 로그아웃 URL
                .addLogoutHandler(customLogoutHandler) // Custom 로그아웃 핸들러 사용
                .logoutSuccessUrl("/") // 로그아웃 후 이동할 URL
                .deleteCookies("jwt", "refreshToken") // 로그아웃 시 JWT 쿠키 삭제
        );

        // 🛑 인증 예외 처리: 인증되지 않은 요청에 대해 401 Unauthorized 응답 반환
        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    log.warn("⚠️ Unauthorized API request for {}: {}", request.getRequestURI(), authException.getMessage());
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                }));

        return http.build(); // 최종적으로 Security 설정을 빌드하여 반환
    }
}
