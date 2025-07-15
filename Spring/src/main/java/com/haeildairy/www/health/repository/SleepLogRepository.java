package com.heaildairy.www.health.repository;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.health.entity.SleepLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SleepLogRepository extends JpaRepository<SleepLog, Long> {
    Optional<SleepLog> findByUserUserIdAndSleepDate(Integer userId, LocalDate sleepDate);

    @Query("SELECT s.sleepDate FROM SleepLog s WHERE s.user.userId = :userId AND FUNCTION('YEAR', s.sleepDate) = :year AND FUNCTION('MONTH', s.sleepDate) = :month")
    List<LocalDate> findActiveDatesByUserIdAndYearMonth(@Param("userId") Integer userId, @Param("year") int year, @Param("month") int month);
    List<SleepLog> findAllByUserUserIdAndSleepDateBetween(Integer userId, LocalDate start, LocalDate end);
}
