package com.heaildairy.www.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // 개발단계이므로 csrf 보안기능 off
            http.csrf((csrf) -> csrf.disable());

        // 로그인 여부 확인 설정 - 현재 모든 페이지 여부 확인 X
            http.authorizeHttpRequests((authorize)->
                authorize.requestMatchers("/**").permitAll() // 항상 허용
            );

        return http.build();
    }
}
