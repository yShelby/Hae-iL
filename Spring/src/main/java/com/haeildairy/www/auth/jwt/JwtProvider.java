// 📄 파일 경로: com.heaildairy.www.auth.jwt.JwtProvider.java
// 📌 역할:
//   - 🔐 Access / Refresh 토큰 생성
//   - ✅ 토큰 유효성 검사 및 인증 정보 추출
//   - 🧠 만료된 토큰에서 Payload 추출
//   - 🧾 Claims 기반으로 Authentication 객체 생성
//
// 📊 데이터 흐름도:
// 1️⃣ 로그인 시 → createAccessToken() / createRefreshToken() 호출
// 2️⃣ 클라이언트 쿠키에 토큰 전달
// 3️⃣ 요청 도착 → JwtAuthenticationFilter가 validateToken() → getAuthentication() 호출
// 4️⃣ 토큰 검증 → 사용자 정보 조회 → SecurityContext에 등록
// 5️⃣ 만료된 토큰인 경우에도 extractToken()을 통해 Claims는 추출 가능

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

@Slf4j
@Component
public class JwtProvider {

    // 🔐 JWT 서명용 시크릿 키 (Base64 디코딩하여 HMAC 키 생성)
    private final SecretKey key;
    private final MyUserDetailService userDetailService;
    private final long accessTokenValidityInMilliseconds = 1000 * 60 * 30;
    private final long refreshTokenValidityInMilliseconds = 1000 * 60 * 60 * 24 * 7;

    // 🔧 생성자: 시크릿 키 세팅 및 의존성 주입
    public JwtProvider(@Value("${jwt.secret}") String secretKey, MyUserDetailService userDetailService) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey)); // Base64 → SecretKey 변환
        this.userDetailService = userDetailService;
    }

    // 🏷️ AccessToken 생성 메서드
    public String createAccessToken(Authentication authentication) {
        return createToken(authentication, accessTokenValidityInMilliseconds);
    }

    // 🏷️ RefreshToken 생성 메서드
    public String createRefreshToken(Authentication authentication) {
        return createToken(authentication, refreshTokenValidityInMilliseconds);
    }

    // 🏭 JWT 토큰 생성 공통 메서드 (사용자 정보 + 권한 + 만료시간 포함)
    private String createToken(Authentication authentication, long validityMillis) {
        // 📦 권한 목록을 문자열로 병합
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validityMillis);

        // 🔐 JWT 빌더 사용해 토큰 생성
        return Jwts.builder()
                .subject(authentication.getName()) // email 등 식별자
                .claim("auth", authorities) // 권한 정보
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key) // HMAC 서명
                .compact();
    }

    // ✅ 토큰 유효성 검사 메서드 (만료 예외는 던짐)
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("⚠️ 유효하지 않은 JWT 토큰: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("🚫 지원되지 않는 JWT 토큰: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("❌ 비어 있는 JWT: {}", e.getMessage());
        }
        return false;
    }

    // 🧾 토큰의 Claims 정보 추출 (만료되었더라도 Payload는 꺼내 쓸 수 있음)
    public Claims extractToken(String token) {
        try {
            return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        } catch (ExpiredJwtException e) {
            return e.getClaims(); // ⏳ 만료되었더라도 Claims는 반환
        }
    }

    // 🧠 토큰에서 인증 객체 생성 (Spring Security가 인식할 수 있는 Authentication 반환)
    public Authentication getAuthentication(String token) {
        Claims claims = extractToken(token);

        // 🔒 auth 클레임이 없으면 예외
        if (claims.get("auth") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 📧 이메일(또는 username) 기반으로 DB에서 사용자 정보 조회
        String email = claims.getSubject();
        CustomUser customUser = (CustomUser) userDetailService.loadUserByUsername(email);

        // 🔑 최종 인증 객체 생성 및 반환 (비밀번호는 null 처리)
        return new UsernamePasswordAuthenticationToken(customUser, "", customUser.getAuthorities());
    }

}
