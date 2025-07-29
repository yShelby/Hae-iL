package com.haeildiary.www.auth.user; // CustomUser가 service 패키지에 있다고 가정

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDateTime;
import java.util.Collection;

/**
 * 📂 CustomUser.java
 * ────────────────────────────────
 * ✅ 역할:
 * - Spring Security의 User 클래스를 확장하여 사용자 인증 정보를 담는 커스텀 UserDetails 구현체
 * - UserEntity의 추가 정보(userId, nickname, profileImage, themeId, lastLoginAt, createdAt)를 포함하여 보관
 *
 * 📊 데이터 흐름도
 * 1️⃣ 사용자 인증 시 UserDetailsService가 DB에서 UserEntity 조회
 * 2️⃣ CustomUser 객체 생성 (부모 User 클래스에 이메일, 비밀번호, 권한 전달)
 * 3️⃣ 추가 사용자 정보 필드 초기화 및 인증 컨텍스트에 저장되어 활용됨
 */

@Getter
@ToString(callSuper = true) // 부모(User) 필드 포함 toString() 생성, Setter는 보안상 제거
public class CustomUser extends User {
    private final Integer userId;
    private final String nickname;
    private final String profileImage;
    private final String themeName;
    private final LocalDateTime lastLoginAt;
    private final LocalDateTime createdAt;

    public CustomUser(
            String email,
            String password,
            Collection<? extends GrantedAuthority> authorities,
            Integer userId,
            String nickname,
            String profileImage,
            String themeName,
            LocalDateTime lastLoginAt,
            LocalDateTime createdAt ) {
        super(email, password, authorities);

        this.userId = userId;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.themeName = themeName;
        this.lastLoginAt = lastLoginAt;
        this.createdAt = createdAt;
    }
}

