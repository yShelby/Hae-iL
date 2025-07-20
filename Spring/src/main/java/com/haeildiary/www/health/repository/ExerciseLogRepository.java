<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/health/repository/ExerciseLogRepository.java
package com.haeildiary.www.health.repository;

import com.haeildiary.www.health.entity.ExerciseLog;
========
package com.haeildairy.www.health.repository;

import com.haeildairy.www.health.entity.ExerciseLog;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/health/repository/ExerciseLogRepository.java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseLogRepository extends JpaRepository<ExerciseLog, Long> {

    // 🔍 특정 날짜 운동 기록 조회
    Optional<ExerciseLog> findByUserUserIdAndExerciseDate(Integer userId, LocalDate exerciseDate);

    // 📅 월별 활성 날짜 조회 (기존 그대로 유지)
    @Query("SELECT e.exerciseDate FROM ExerciseLog e WHERE e.user.userId = :userId AND FUNCTION('YEAR', e.exerciseDate) = :year AND FUNCTION('MONTH', e.exerciseDate) = :month")
    List<LocalDate> findActiveDatesByUserIdAndYearMonth(@Param("userId") Integer userId,
                                                        @Param("year") int year,
                                                        @Param("month") int month);

    // ✅ 추가: 날짜 범위 운동 기록 조회
    List<ExerciseLog> findAllByUserUserIdAndExerciseDateBetween(Integer userId, LocalDate start, LocalDate end);
}
