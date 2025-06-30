package com.heaildairy.www.auth;

import com.heaildairy.www.auth.jwt.JwtAuthenticationFilter;
import jakarta.servlet.http.Cookie;
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

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    // JwtAuthenticationFilter 등록
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

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

        // 세션 데이터 생성 방지
//        http.sessionManagement((session) -> session
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//        );
        // 세션 데이터 생성
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // 세션 허용 (Thymeleaf 사용시 필수)
        );

        // 필터 실행위치 설정
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);


        // 로그인 여부 확인 설정
        http.authorizeHttpRequests((authorize)-> authorize
//                .requestMatchers("/**").permitAll() // 항상 허용
                .requestMatchers("/", "/login/jwt", "/register", "/register/newUser", "/reissue").permitAll() // 인증 불필요 경로
                .requestMatchers("/css/**","/js/**","/image/**").permitAll() // 정적 리소스 허용
                .anyRequest().authenticated() // 나머지 모든 요청은 반드시 인증 필요
        );

        // 로그아웃 DSL
        http.logout(logout -> logout
                        .logoutUrl("/logout") // 로그아웃 URL
                        .logoutSuccessUrl("/") // 로그아웃 성공 시 이동할 URL
                        .addLogoutHandler((request, response, authentication) -> {
                            // 쿠키 삭제
                            Cookie accessCookie = new Cookie("jwt", "");
                            accessCookie.setHttpOnly(true);
                            accessCookie.setPath("/");
                            accessCookie.setMaxAge(0);
                            response.addCookie(accessCookie);

                            Cookie refreshCookie = new Cookie("refreshToken", "");
                            refreshCookie.setHttpOnly(true);
                            refreshCookie.setPath("/");
                            refreshCookie.setMaxAge(0);
                            response.addCookie(refreshCookie);
                        })
                );


        return http.build();
    }
}
