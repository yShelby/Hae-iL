package com.haeildiary.www.health.entity;

import com.haeildiary.www.auth.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ExerciseLog")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_id")
    private Long exerciseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "exercise_date",nullable = false)
    private LocalDate exerciseDate; // 운동 날짜

    @Column(name = "exercise_type",length = 100, nullable = false)
    private String exerciseType; // 운동 종류

    @Column(nullable = true)
    private Integer duration; // 운동 시간 (분)

    @Column(length = 20, nullable = true)
    private String intensity; // 운동 강도

    @Column(name = "create_at", updatable = false, nullable = false)
    private LocalDateTime createdAt; // 생성 시간

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // 엔티티 생성 시 현재 시간으로 설정
    }
}
