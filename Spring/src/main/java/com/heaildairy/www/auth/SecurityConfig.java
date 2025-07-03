package com.heaildairy.www.auth;

import com.heaildairy.www.auth.jwt.CustomLogoutHandler; // 추가
import com.heaildairy.www.auth.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
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
import org.springframework.security.web.util.matcher.AntPathRequestMatcher; // 추가

/**
 * 📂 SecurityConfig.java
 * ────────────────────────────────
 * ✅ 역할:
 * - Spring Security의 전반적인 보안 설정 담당
 * - JWT 인증 필터를 Security 필터 체인에 추가하여 Stateless 인증 구성
 * - URL별 접근 권한 설정 및 인증/인가 예외 처리 설정
 * - 커스텀 로그아웃 핸들러를 등록하여 로그아웃 시 Refresh Token DB 삭제, 쿠키 삭제 처리
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트 요청 수신
 * 2️⃣ JWTAuthenticationFilter를 통해 JWT 토큰 검사 및 인증 처리 (Stateless)
 * 3️⃣ 허용된 경로 외 요청은 인증된 사용자만 접근 가능
 * 4️⃣ 로그아웃 시 CustomLogoutHandler가 호출되어 DB 토큰 삭제 및 쿠키 삭제 수행
 * 5️⃣ 인증 실패 시 메인 페이지로 리다이렉트
 */

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter; // JWT 인증 필터 주입
    private final CustomLogoutHandler customLogoutHandler;         // 로그아웃 시 DB 처리 핸들러 주입

    // 🔐 비밀번호 암호화 빈 등록 (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔑 AuthenticationManager 빈 등록 (인증 처리 관리자)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 🔒 Security 필터 체인 구성
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1️⃣ CSRF 비활성화 (JWT 기반 stateless API에서 필요 없음)
                .csrf(AbstractHttpConfigurer::disable)

                // 2️⃣ 세션 정책 Stateless 설정 (서버에 세션 저장하지 않음)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 3️⃣ JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 삽입
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // 4️⃣ URL별 접근 권한 설정
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/",                    // 메인 페이지
                                "/login/jwt",           // 로그인 API
                                "/register/**",         // 회원가입 관련
                                "/find-email/**",       // 이메일 찾기
                                "/find-password/**",    // 비밀번호 찾기
                                // /send 같은 POST 요청은 제대로 매칭되지 않는 이슈가 있어서, 명시적으로 추가하는 걸 권장
                                "/find-password/send",  // 임시 비밀번호 발송
                                "/css/**",              // 정적 리소스 (CSS)
                                "/js/**",               // 정적 리소스 (JS)
                                "/static/**",           // 기타 정적 리소스
                                "/error"                // 에러 페이지
                        )
                        .permitAll()               // 위 경로들은 인증 없이 접근 허용
                        .anyRequest().authenticated()  // 그 외 요청은 인증 필요
                );

        // 5️⃣ 로그아웃 설정
        http.logout(logout -> logout
                // POST /logout 요청에 대해 처리 (명시적으로 POST 메서드 사용 지정)
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "POST"))

                // 로그아웃 핸들러 등록 (DB Refresh Token 삭제)
                .addLogoutHandler(customLogoutHandler)

                // 로그아웃 성공 후 리다이렉트 URL
                .logoutSuccessUrl("/")

                // 세션 무효화 처리
                .invalidateHttpSession(true)

                // JWT, RefreshToken 쿠키 삭제
                .deleteCookies("jwt", "refreshToken")
        );

        // 6️⃣ 인증 실패 시 처리 (인증 안 된 사용자가 보호된 자원 접근 시)
        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendRedirect("/"); // 인증 실패하면 메인 페이지로 리다이렉트
                }));

        return http.build();
    }
}
