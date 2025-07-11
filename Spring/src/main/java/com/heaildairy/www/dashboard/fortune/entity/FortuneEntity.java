package com.heaildairy.www.dashboard.fortune.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "fortune_cookie")
public class FortuneEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cookie_id")
    private Integer cookieId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    // 데이터 초기화를 편리하게 하기 위한 생성자
    public FortuneEntity(String message) {
        this.message = message;
    }
}
