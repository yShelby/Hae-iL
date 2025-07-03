package com.heaildairy.www.auth.entity;

import com.heaildairy.www.auth.user.UserStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime; // LocalDateTime 임포트 (Java 8 이상)

@Entity
@Table(name = "Users")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID로 자동 생성
    @Column(name = "user_id") // 컬럼명 변경
    private Integer userId; // 필드명 변경

    @Column(name = "email", nullable = false, unique = true) // 이메일 == 사용자 로그인 ID
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

//    // 회원의 상태를 나타내는 Enum 필드 추가
//    @Enumerated(EnumType.STRING)
//    @Column(name = "status", nullable = false)
//    private UserStatus status; // 필드명은 'status'로 하는 게 일반적
//
//    // 신규 회원이 가입될 때 기본 상태를 ACTIVE로 설정
//    @PrePersist
//    protected void onRegister() {
//        if (this.status == null) { // status 필드가 아직 설정되지 않았다면 (최초 저장 시)
//            this.status = UserStatus.ACTIVE;
//        } else if (this.status == UserStatus.INACTIVE) { // 재가입 회원일 경우 ACTIVATE
//            this.status = UserStatus.ACTIVE;
//        };
//    }

    @Column(name = "name", nullable = true)
    private String name;

    @Column(name = "phone_number", nullable = false)
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