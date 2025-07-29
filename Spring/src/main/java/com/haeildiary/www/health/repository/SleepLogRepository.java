package com.haeildiary.www.health.repository;

import com.haeildiary.www.health.entity.SleepLog;
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

    // 차트용 조회 쿼리
    @Query("""
            SELECT s.sleepDate, s.bedtime, s.waketime
            FROM SleepLog s
            WHERE s.user.userId = :userId
            AND s.sleepDate BETWEEN :startDate AND :endDate
            ORDER BY s.sleepDate ASC
            """)
    List<Object[]> findSleepDataForChart(@Param("userId") Integer userId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);

}
