package com.heaildairy.www.health.entity;

import com.heaildairy.www.auth.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "SleepLog")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SleepLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sleep_id")
    private Long sleepId; // 수면 기록 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "user_id", nullable = false)
    private UserEntity user; // 사용자 ID (외래키)

    @Column(name="sleep_date", nullable = false)
    private LocalDate sleepDate; // 수면 날짜

    @Column(nullable = true)
    private LocalTime bedtime; // 취침 시간

    @Column(nullable = true)
    private LocalTime waketime; // 기상 시간

    @Column(name="total_hours", nullable = true)
    private Double totalHours; // 총 수면 시간(시간 단위, 소수점 1자리까지 저장)

    @Column(name = "create_at", updatable = false, nullable = false)
    private LocalDateTime createdAt; // 생성 일시 (업데이트 불가)

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now(); // 엔티티 생성 시 현재 시간으로 설정
    }
}
