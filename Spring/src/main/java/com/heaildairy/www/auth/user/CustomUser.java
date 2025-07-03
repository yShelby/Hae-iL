package com.heaildairy.www.auth.user;

import lombok.Getter;
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

    // 1️⃣ 사용자 고유 ID (DB userId와 매핑, Integer 타입)
    private final Integer userId;

    // 2️⃣ 사용자 닉네임
    private final String nickname;

    // 3️⃣ 프로필 이미지 URL 또는 경로
    private final String profileImage;

    // 4️⃣ 테마 설정 ID (사용자 UI 테마 관리용)
    private final Integer themeId;

    // 5️⃣ 마지막 로그인 시각
    private final LocalDateTime lastLoginAt;

    // 6️⃣ 계정 생성 시각
    private final LocalDateTime createdAt;

    // 7️⃣ 생성자: 부모(User) 생성자 호출 + CustomUser 필드 초기화
    public CustomUser(
            String email,
            String password,
            Collection<? extends GrantedAuthority> authorities,
            Integer userId,       // User 고유 ID
            String nickname,      // 닉네임
            String profileImage,  // 프로필 이미지
            Integer themeId,      // 테마 ID
            LocalDateTime lastLoginAt, // 마지막 로그인 시간
            LocalDateTime createdAt     // 계정 생성 시간
    ) {
        super(email, password, authorities); // 부모 User 필수 초기화

        this.userId = userId;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.themeId = themeId;
        this.lastLoginAt = lastLoginAt;
        this.createdAt = createdAt;
    }
}
