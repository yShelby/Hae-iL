package com.heaildairy.www.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * JWT 토큰 생성, 검증, 파싱을 담당하는 클래스
 * 실무에서 사용하는 주요 패턴(토큰 생성, 검증, 인증 객체 생성)을 모두 구현
 */
@Slf4j // 로그를 남기기 위한 Lombok 어노테이션
@Component
public class JwtProvider {

    // JWT 사용할 암호화 키
    private SecretKey key;

    // Access Token의 만료 시간(5분, 밀리초 단위)
    private long accessTokenValidityInMilliseconds = 1000 * 60 * 5;
    // Refresh Token의 만료 시간(7일, 밀리초 단위)
    private long refreshTokenValidityInMilliseconds = 1000 * 60 * 60 * 24 * 7;

    // application.properties에서 secret 값을 주입받아 키를 생성
    public JwtProvider(@Value("${jwt.secret}") String secretKey) {
        // Base64로 인코딩된 secretKey를 디코딩하여 키로 변환
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    // Access Token 생성
    public String createAccessToken(Authentication authentication) {
        return createToken(authentication, accessTokenValidityInMilliseconds);
    }

    // Refresh Token 생성
    public String createRefreshToken(Authentication authentication) {
        return createToken(authentication, refreshTokenValidityInMilliseconds);
    }

    // 공동토큰 생성
    private String createToken(Authentication authentication, long validityMillis) {
        // 권한 정보를 문자열로 변환 (예: "ROLE_USER,ROLE_ADMIN")
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        // 현재 시간과 만료 시간 계산
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + validityMillis);

        // JWT 생성
        return Jwts.builder()
                .subject(authentication.getName()) // 사용자 이름( 아이디)
                .claim("auth", authorities) // 권한 정보 저장
                .issuedAt(now) // 발급 시간
                .expiration(expiryDate) // 만료 시간
                .signWith(key) // 서명에 사용할 키
                .compact(); // 문자열로 변환
    }

    // 토큰 유효성 검증 및 예외 처리
    public boolean validateToken(String token) {
        try {
            // 토큰 파싱 및 서명 검증
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


    // 토큰에서 정보 추출 - Claims 객체로 반환
    public Claims extractToken(String token) {
        // 토큰 파싱 및 서명 검증 후 클레임 반환
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    // Authentication - 토큰에서 인증 정보 추출
    public Authentication getAuthentication(String token) {
        Claims claims = extractToken(token);

        // 권한 정보가 없으면 예외 발생
        if (claims.get("auth") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 권한 문자열을 리스트로 변환
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("auth").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        // Spring Security의 UserDetails 객체 생성
        User principal = new User(claims.getSubject(), "", authorities);

        // 인증 객체 반환 (Credential은 비밀번호 대신 토큰을 사용하므로 빈 문자열)
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

}