<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/service/LogoutService.java
package com.haeildiary.www.auth.service;

import com.haeildiary.www.auth.jwt.JwtProvider;
========
package com.haeildairy.www.auth.service;

import com.haeildairy.www.auth.jwt.JwtProvider;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/service/LogoutService.java
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogoutService {

    private final UserService userService;
    private final JwtProvider jwtProvider;

    /**
     * 로그아웃 처리를 위한 통합 메소드.
     * DB의 리프레시 토큰 삭제, 세션 무효화, 인증 쿠키 삭제를 모두 수행합니다.
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     */
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // 1. DB에서 Refresh Token 삭제
        // SecurityContext에서 인증 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = null;

        // 인증된 사용자인 경우, 컨텍스트에서 이메일 획득
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            email = authentication.getName();
        } else {
            // 인증 정보가 없는 경우, 쿠키에서 Refresh Token을 찾아 이메일 획득 (Stateless 클라이언트 대응)
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("refreshToken".equals(cookie.getName())) {
                        try {
                            Claims claims = jwtProvider.extractToken(cookie.getValue());
                            email = claims.getSubject();
                        } catch (Exception e) {
                            log.error("로그아웃 처리 중 Refresh Token 파싱 실패", e);
                        }
                        break;
                    }
                }
            }
        }

        // 이메일을 성공적으로 찾았다면 DB에서 토큰 삭제
        if (email != null) {
            userService.logout(email);
        }

        // 2. 세션 무효화
        HttpSession session = request.getSession(false); // 세션이 없으면 새로 생성하지 않음
        if (session != null) {
            session.invalidate();
        }

        // 3. 인증 관련 쿠키 삭제
        Cookie jwtCookie = new Cookie("jwt", "");
        jwtCookie.setMaxAge(0);
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);

        Cookie refreshCookie = new Cookie("refreshToken", "");
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);
    }
}
