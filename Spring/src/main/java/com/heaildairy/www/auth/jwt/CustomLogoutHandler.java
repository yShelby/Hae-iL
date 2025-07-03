package com.heaildairy.www.auth.jwt;

import com.heaildairy.www.auth.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 📂 CustomLogoutHandler.java
 * ────────────────────────────────
 * ✅ 역할:
 * - 사용자 로그아웃 시 Refresh Token 쿠키를 찾아서 파싱
 * - 토큰에서 이메일 추출 후 DB에서 해당 사용자의 Refresh Token 삭제
 * - 로그아웃 시 서버 측 토큰 무효화 책임지는 컴포넌트
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트 요청에서 Cookie 배열 추출
 * 2️⃣ refreshToken 쿠키 탐색 및 값 추출
 * 3️⃣ 토큰 파싱하여 이메일 얻기
 * 4️⃣ DB에서 해당 이메일의 Refresh Token 삭제
 * 5️⃣ 로그아웃 성공 또는 에러 로그 기록
 */

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProvider jwtProvider;

    @Override
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        // 1️⃣ 쿠키 배열에서 refreshToken 값 찾기
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue(); // 🍪 refreshToken 쿠키 값 추출
                    break;
                }
            }
        }

        // 2️⃣ refreshToken이 있으면 파싱해서 이메일 추출 후 DB에서 토큰 삭제
        if (refreshToken != null) {
            try {
                // 🔐 refreshToken에서 Claims 추출
                Claims claims = jwtProvider.extractToken(refreshToken);
                String email = claims.getSubject(); // 📧 이메일 추출

                // 🧹 DB에서 해당 이메일의 Refresh Token 삭제
                refreshTokenRepository.deleteByEmail(email);
                log.info("Successfully deleted refresh token for user: {}", email);
            } catch (Exception e) {
                log.error("Error processing refresh token on logout", e); // ❌ 실패 로그 기록
            }
        }
    }
}
