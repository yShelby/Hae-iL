package com.heaildairy.www.auth.jwt;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.auth.service.MyUserDetailService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * 📂 JwtProvider.java
 * ────────────────────────────────
 * ✅ 역할:
 * - JWT Access Token 및 Refresh Token 생성, 검증, 파싱 기능 제공
 * - 토큰에 사용자 권한 정보 포함
 * - 토큰에서 Authentication 객체 생성 지원
 *
 * 📊 데이터 흐름도
 * 1️⃣ 인증 성공 시 Authentication 객체로부터 권한 정보와 사용자 이름 추출
 * 2️⃣ Access / Refresh 토큰 생성 (유효기간 각각 다름)
 * 3️⃣ 클라이언트에서 전달받은 토큰 유효성 검사
 * 4️⃣ 토큰에서 Claims 추출
 * 5️⃣ Claims 기반으로 Authentication 객체 생성하여 Spring Security 인증 처리에 사용
 */

@Slf4j
@Component
public class JwtProvider {

    private final SecretKey key;
    private final MyUserDetailService userDetailService;

    // ⏳ Access Token 만료시간 5분 (밀리초 단위)
    private final long accessTokenValidityInMilliseconds = 1000 * 60 * 5;
    // ⏳ Refresh Token 만료시간 7일
    private final long refreshTokenValidityInMilliseconds = 1000 * 60 * 60 * 24 * 7;

    public JwtProvider(@Value("${jwt.secret}") String secretKey, MyUserDetailService userDetailService) {
        // 🔐 Base64 인코딩된 비밀키로 SecretKey 생성
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.userDetailService = userDetailService;
    }

    // 1️⃣ Access Token 생성 (권한 포함)
    public String createAccessToken(Authentication authentication) {
        return createToken(authentication, accessTokenValidityInMilliseconds);
    }

    // 2️⃣ Refresh Token 생성 (권한 포함)
    public String createRefreshToken(Authentication authentication) {
        return createToken(authentication, refreshTokenValidityInMilliseconds);
    }

    // 토큰 생성 핵심 메서드 (subject, 권한, 발행시간, 만료시간 포함)
    private String createToken(Authentication authentication, long validityMillis) {
        // ⚙️ 권한 리스트를 콤마로 연결한 문자열로 변환
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validityMillis);

        // 🧱 JWT 빌더로 토큰 생성
        return Jwts.builder()
                .subject(authentication.getName())     // 주체 (보통 username or email)
                .claim("auth", authorities)            // 권한 정보 커스텀 클레임으로 추가
                .issuedAt(now)                         // 발행 시간
                .expiration(expiryDate)                // 만료 시간
                .signWith(key)                         // 비밀키로 서명
                .compact();
    }

    // 3️⃣ 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            // 🛡️ 서명 검증 및 토큰 구조 검사
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("유효하지 않은 JWT 토큰: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT 토큰: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("지원되지 않는 JWT 토큰: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT 클레임 문자열이 비어 있습니다: {}", e.getMessage());
        }
        return false;
    }

    // 4️⃣ 토큰에서 Claims 추출 (payload 정보)
    public Claims extractToken(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    // 5️⃣ 토큰으로부터 Authentication 객체 생성 (Spring Security 연동용)
    public Authentication getAuthentication(String token) {
        Claims claims = extractToken(token);

        // ⚠️ 권한 정보 없으면 예외 발생
        if (claims.get("auth") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        String email = claims.getSubject();

        // 🔍 DB에서 사용자 정보 조회 (CustomUser 반환)
        CustomUser customUser = (CustomUser) userDetailService.loadUserByUsername(email);

        // 🧩 Authentication 객체 생성 (principal: CustomUser, credentials: 비워둠, 권한 포함)
        return new UsernamePasswordAuthenticationToken(customUser, "", customUser.getAuthorities());
    }
}
