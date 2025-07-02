package com.heaildairy.www.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime; // LocalDateTime 임포트 (Java 8 이상)

@Entity
@Table(name = "User")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // UUID로 자동 생성
    @Column(name = "user_id", columnDefinition = "CHAR(36)") // 컬럼명 변경, UUID 타입
    private String userId; // 필드명 변경

    @Column(name = "email", nullable = false, unique = true) // 이메일 == 사용자 로그인 ID
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name", nullable = true)
    private String name;

    @Column(name = "phone_number", nullable = true)
    private String encryptedPhoneNumber;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "profile_image", nullable = true)
    private String profileImage;

    @Column(name = "theme_id", nullable = true)
    private Integer themeId;

    @Column(name = "last_login_at", nullable = true)
    private LocalDateTime lastLoginAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // 생성 시점 자동화 필요

    @PrePersist // 엔티티 저장 전 호출되어 created_at 자동 설정
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}