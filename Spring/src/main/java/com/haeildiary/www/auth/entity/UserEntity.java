package com.haeildiary.www.auth.entity;

import com.haeildiary.www.auth.user.UserStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable; // Serializable 임포트 추가
import java.time.LocalDate;
import java.time.LocalDateTime; // LocalDateTime 임포트 (Java 8 이상)

@Entity
@Table(name = "Users")
@Getter
@Setter
public class UserEntity implements Serializable { // Serializable 구현 추가

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID로 자동 생성
    @Column(name = "user_id") // 컬럼명 변경
    private Integer userId; // 필드명 변경

    // Serializable 인터페이스 구현 시 serialVersionUID를 명시하는 것이 좋음
    private static final long serialVersionUID = 1L; // 이 줄도 추가

    @Column(name = "email", nullable = false, unique = true) // 이메일 == 사용자 로그인 ID
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    // 회원의 상태를 나타내는 Enum 필드 추가
    // 신규 회원이 가입될 때 기본 상태를 ACTIVE로 설정
    @Enumerated(EnumType.STRING)
    @Column(name = "user_status", nullable = false)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "name", nullable = true)
    private String name;

    @Column(name = "phone_number", nullable = false)
    private String encryptedPhoneNumber;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "profile_image", nullable = true)
    private String profileImage;

//    @ColumnDefault("'theme_1'")
    @Column(name = "theme_name", nullable = false)
    private String themeName = "theme_1";

    @Column(name = "last_login_at", nullable = true)
    private LocalDateTime lastLoginAt;

    @CreationTimestamp // @PrePersist ~~ 를 @CreationTimestamp로 대체(축약)
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // 생성 시점 자동화 필요

    // 이 필드는 "하루에 한 번만 쿠키를 열 수 있다"는 핵심 비즈니스 로직을 구현하기 위해
    // 반드시 필요한 데이터 사용자가 마지막으로 쿠키를 연 날짜를 저장하여 오늘 날짜와 비교하는 용도로 사용
    @Column(name = "last_opened_at")
    private LocalDate lastFortuneOpenedDate;

    public void updateLastFortuneOpenedDate(LocalDate date) {
        this.lastFortuneOpenedDate = date;
    }

    // [리팩토링] RefreshToken과의 양방향 관계 설정
    // CascadeType.ALL: User 변경 시 RefreshToken도 함께 변경(저장, 삭제 등)
    // orphanRemoval = true: User와 RefreshToken의 연관관계가 끊어지면 RefreshToken 자동 삭제
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private RefreshToken refreshToken;

//    @PrePersist // 엔티티 저장 전 호출되어 created_at 자동 설정
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }

    // 이 필드는 초기 감정 상태와 장르 상태를 JSON 형태로 저장하기 위해 추가
    @Column(name = "initial_emotion", nullable = true, columnDefinition = "json")
    private String initialEmotion; // 초기 감정 상태를 JSON 형태로 저장

    @Column(name = "inital_genre", nullable = true, columnDefinition = "json")
    private String initialGenre; // 초기 장르 상태를 JSON 형태로 저장
}