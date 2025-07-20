<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/health/entity/MealLog.java
package com.haeildiary.www.health.entity;

import com.haeildiary.www.auth.entity.UserEntity;
========
package com.haeildairy.www.health.entity;

import com.haeildairy.www.auth.entity.UserEntity;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/health/entity/MealLog.java
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="MealLog")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_id")
    private Long mealId; // 식사 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private UserEntity user;


    @Column(name = "meal_date", nullable = false)
    private LocalDate mealDate; // 식사 날짜

    @Column(columnDefinition = "TEXT", nullable = true)
    private String breakfast; // 아침 식사 내용

    @Column(columnDefinition = "TEXT", nullable = true)
    private String lunch; // 점심 식사 내용

    @Column(columnDefinition = "TEXT", nullable = true)
    private String dinner; // 저녁 식사 내용


    @Column(columnDefinition = "TEXT", nullable = true)
    private String snack; // 간식 내용

    @Column(name = "create_at",updatable = false, nullable = true)
    private LocalDateTime createdAt; // 생성 시간

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // 엔티티 생성 시 현재 시간으로 설정
    }
}
