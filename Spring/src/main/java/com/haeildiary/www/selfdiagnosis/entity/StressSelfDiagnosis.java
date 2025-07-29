package com.haeildiary.www.selfdiagnosis.entity;


import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.selfdiagnosis.common.CommonStatusAccessor;
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
@Table(name = "stress_self_diagnosis")
public class StressSelfDiagnosis implements CommonStatusAccessor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stress_id")
    private Integer stressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    @Builder.Default
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

    // === CommonStatusAccessor 메서드 구현 ===
    @Override
    public Boolean getAvailable() {
        return available;
    }

    @Override
    public Integer getPercentage() {
        return percentage;
    }

    @Override
    public String getResult() {
        return result;
    }

    @Override
    public LocalDate getNextAvailableDate() {
        return nextAvailableDate;
    }

}
