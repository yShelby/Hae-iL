package com.haeildiary.www.selfdiagnosis.entity;

import com.haeildiary.www.auth.entity.UserEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "depression_self_diagnosis")
public class DepressionSelfDiagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "depression_id")
    private Integer depressionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private Boolean available = false;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Column(nullable = false)
    private Integer percentage;

    @Column(nullable = false)
    private String result;

    @Column(name = "next_available_date", nullable = false)
    private LocalDate nextAvailableDate;

    @CreationTimestamp
    @Column(name = "assessment_date", nullable = false, updatable = false)
    private LocalDate assessmentDate;

}
