package com.haeildiary.www.charts.repository;

import com.haeildiary.www.charts.dto.ExerciseDurationDto;
import com.haeildiary.www.health.entity.ExerciseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseDurationRepository extends JpaRepository<ExerciseLog, Long> {
    @Query("""
            SELECT new com.haeildiary.www.charts.dto.ExerciseDurationDto(e.duration)
            FROM ExerciseLog e
            WHERE e.user.userId = :userId
                AND e.exerciseDate BETWEEN :start AND :end
            """)
    List<ExerciseDurationDto> findExerciseDurationBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
