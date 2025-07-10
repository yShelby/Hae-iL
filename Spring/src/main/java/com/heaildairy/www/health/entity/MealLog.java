package com.heaildairy.www.health.entity;

import com.heaildairy.www.auth.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="meal_log")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mealId; // 식사 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private UserEntity user;


    @Column(nullable = false)
    private LocalDate mealDate; // 식사 날짜

    @Column(columnDefinition = "TEXT", nullable = true)
    private String breakfast; // 아침 식사 내용

    @Column(columnDefinition = "TEXT", nullable = true)
    private String lunch; // 점심 식사 내용

    @Column(columnDefinition = "TEXT", nullable = true)
    private String dinner; // 저녁 식사 내용


    @Column(columnDefinition = "TEXT", nullable = true)
    private String snack; // 간식 내용

    @Column(updatable = false, nullable = true)
    private LocalDateTime createdAt; // 생성 시간

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // 엔티티 생성 시 현재 시간으로 설정
    }
}
