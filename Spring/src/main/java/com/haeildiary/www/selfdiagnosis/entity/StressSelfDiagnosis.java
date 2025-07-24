package com.haeildiary.www.selfdiagnosis.entity;


import com.haeildiary.www.auth.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "stress_self_diagnosis")
public class StressSelfDiagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stress_id")
    private Integer stressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private Integer result;

    @CreationTimestamp
    @Column(name = "assessment_date", nullable = false, updatable = false)
    private LocalDateTime assessmentDate;

}
