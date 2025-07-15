package com.haeildairy.www.auth.jwt;

import com.haeildairy.www.auth.event.LogoutEvent; // LogoutEvent 임포트
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher; // ApplicationEventPublisher 임포트
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomLogoutHandler implements LogoutHandler {

    private final JwtProvider jwtProvider;
    private final ApplicationEventPublisher eventPublisher; // ApplicationEventPublisher 주입

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        log.debug("CustomLogoutHandler: Starting logout process.");
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    log.debug("CustomLogoutHandler: Found refreshToken cookie. Value: {}", refreshToken != null ? "present" : "null");
                    break;
                }
            }
        } else {
            log.debug("CustomLogoutHandler: No cookies found in the request.");
        }

        if (refreshToken != null) {
            try {
                Claims claims = jwtProvider.extractToken(refreshToken);
                String email = claims.getSubject();
                log.debug("CustomLogoutHandler: Extracted email from refresh token: {}", email);

                // LogoutEvent 발행
                eventPublisher.publishEvent(new LogoutEvent(this, email));
                log.info("CustomLogoutHandler: Published LogoutEvent for user: {}", email);

            } catch (Exception e) {
                log.error("CustomLogoutHandler: Error processing refresh token on logout: {}", e.getMessage(), e);
            }
        } else {
            log.debug("CustomLogoutHandler: No refresh token found in cookies.");
        }
        log.debug("CustomLogoutHandler: Logout process finished.");
    }
}

