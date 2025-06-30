package com.heaildairy.www.auth.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Entity
@Getter
@RequiredArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String refreshToken;

    @Builder
    public RefreshToken(String email, String refreshToken) {
        this.email = email;
        this.refreshToken = refreshToken;
    }
}

