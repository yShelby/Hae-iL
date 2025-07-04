package com.heaildairy.www.auth.jwt;

import io.jsonwebtoken.ExpiredJwtException;
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
import java.util.Arrays;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 🥇 Step 1: AccessToken을 쿠키("jwt") 또는 Authorization 헤더에서 추출
        String accessToken = resolveToken(request, "jwt");

        try {
            // 🛡️ Step 2: AccessToken이 유효한 경우
            if (StringUtils.hasText(accessToken) && jwtProvider.validateToken(accessToken)) {
                Authentication authentication = jwtProvider.getAuthentication(accessToken); // 🔓 인증 객체 생성
                SecurityContextHolder.getContext().setAuthentication(authentication); // 🔐 Spring Security에 인증 정보 설정
                log.debug("✅ Access Token is valid. Authenticated user: {}", authentication.getName());
            }
        } catch (ExpiredJwtException e) {
            // ⏳ Step 3: Access Token 만료 시 Refresh Token 재발급 시도
            log.warn("⚠️ Access Token has expired. Attempting to refresh token...");

            // 🔄 Step 4: Refresh Token 쿠키에서 추출
            String refreshToken = resolveToken(request, "refreshToken");

            // 🔁 Step 5: Refresh Token이 유효하면
            if (StringUtils.hasText(refreshToken) && jwtProvider.validateToken(refreshToken)) {
                log.info("🔁 Refresh Token is valid. Issuing new Access Token.");

                // 인증 정보 재생성
                Authentication authentication = jwtProvider.getAuthentication(refreshToken);

                // 새 Access Token 생성
                String newAccessToken = jwtProvider.createAccessToken(authentication);

                // 🔐 새 Access Token 쿠키로 발급
                Cookie newAccessTokenCookie = new Cookie("jwt", newAccessToken);
                newAccessTokenCookie.setHttpOnly(true);
                newAccessTokenCookie.setPath("/");
                // newAccessTokenCookie.setSecure(true); // 👉 HTTPS 환경에서만 주석 해제
                response.addCookie(newAccessTokenCookie);

                // SecurityContext에 인증 객체 등록
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("✅ New Access Token issued and user authenticated.");
            } else {
                // ❌ Refresh Token도 유효하지 않음
                log.warn("❌ Refresh Token is invalid or not present. Clearing security context.");
                SecurityContextHolder.clearContext();
            }

        } catch (Exception e) {
            // 🛑 예외 발생 시 SecurityContext 초기화
            log.error("🚨 Could not set user authentication in security context", e);
            SecurityContextHolder.clearContext();
        }

        // 🔚 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }

    /**
     * 🍪 특정 이름의 토큰을 쿠키에서 추출 (없으면 Authorization 헤더로 fallback)
     */
    private String resolveToken(HttpServletRequest request, String tokenName) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(cookie -> tokenName.equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        // 📦 Fallback: Authorization 헤더에서 Bearer 토큰 추출
        if ("jwt".equals(tokenName)) {
            String bearerToken = request.getHeader("Authorization");
            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                return bearerToken.substring(7); // "Bearer " 제거
            }
        }

        return null;
    }
}
