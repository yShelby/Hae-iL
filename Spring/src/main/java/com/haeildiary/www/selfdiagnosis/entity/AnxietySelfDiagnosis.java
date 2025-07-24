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
@Table(name = "anxiety_self_diagnosis")
public class AnxietySelfDiagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "anxiety_id")
    private Integer anxietyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private Integer result;

    @CreationTimestamp
    @Column(name = "assessment_date", nullable = false, updatable = false)
    private LocalDateTime assessmentDate;

}
