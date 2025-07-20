package com.haeildairy.www.auth.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Tokens")
@Getter
@Setter
@RequiredArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long tokenId;

    // [리팩토링] String email 필드를 UserEntity 객체로 대체하여 명확한 연관관계 설정
    @OneToOne(fetch = FetchType.LAZY) // 성능 최적화를 위한 지연 로딩 설정 -> 하지만 활용 시점에 따라 문제가 될 수도 있으니 주의!
    @JoinColumn(name = "user_id", nullable = false, unique = true) // 외래키 설정
    private UserEntity user;

    @Column(name = "refresh_token", nullable = false)
    private String refreshToken;

    @Builder
    // [리팩토링] 생성자에서 UserEntity 객체를 받도록 수정
    public RefreshToken(UserEntity user, String refreshToken) {
        this.user = user;
        this.refreshToken = refreshToken;
    }
}
