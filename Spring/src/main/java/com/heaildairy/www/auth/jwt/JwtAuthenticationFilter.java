package com.heaildairy.www.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * 📂 JwtAuthenticationFilter.java
 * ────────────────────────────────
 * ✅ 역할:
 * - 모든 HTTP 요청마다 JWT 토큰 존재 여부 검사 및 유효성 검증
 * - 유효한 토큰이면 SecurityContext에 인증 정보 등록 → Spring Security 인증 흐름 연동
 * - JWT 토큰은 쿠키 또는 Authorization 헤더에서 추출 가능
 *
 * 📊 데이터 흐름도
 * 1️⃣ HTTP 요청 수신 → 토큰 추출 시도 (쿠키 'jwt' 우선, 없으면 Authorization 헤더)
 * 2️⃣ 토큰 존재 & 유효성 검사 진행
 * 3️⃣ 유효하면 토큰에서 Authentication 객체 생성 → SecurityContext에 저장
 * 4️⃣ 인증 실패하거나 토큰 없으면 인증 미설정 상태 유지
 * 5️⃣ 다음 필터 체인으로 요청 전달
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1️⃣ 요청에서 JWT 토큰 추출 (쿠키 우선 → 헤더)
        String token = resolveToken(request);

        // 2️⃣ 토큰 존재 && 유효한지 검사
        if (token != null && jwtProvider.validateToken(token)) {
            try {
                // 3️⃣ 유효한 토큰에서 Authentication 객체 생성 후 SecurityContext에 설정
                Authentication authentication = jwtProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Authenticated user: {}, authorities: {}", authentication.getName(), authentication.getAuthorities());
            } catch (Exception e) {
                // ❌ 인증 객체 설정 실패 시 로그 기록
                log.error("Could not set user authentication in security context", e);
            }
        } else {
            // ⚠️ 유효한 토큰 없을 때 로그 (보안상 인증 무시 상태)
            log.debug("No valid JWT token found, uri: {}", request.getRequestURI());
        }

        // 4️⃣ 인증 여부와 상관없이 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }

    /**
     * 토큰 추출 헬퍼 메서드
     * - 쿠키에서 'jwt' 토큰 우선 탐색
     * - 없으면 Authorization 헤더의 'Bearer ' 토큰 탐색
     * - 없으면 null 반환
     */
    private String resolveToken(HttpServletRequest request) {
        // 🍪 쿠키에서 'jwt' 토큰 탐색
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        // 🔑 Authorization 헤더에서 Bearer 토큰 탐색
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        // 토큰 없으면 null 반환
        return null;
    }
}
