package com.haeildiary.www.charts.repository;

import com.haeildiary.www.charts.dto.SleepTimeDto;
import com.haeildiary.www.health.entity.SleepLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SleepTimeRepository extends JpaRepository<SleepLog, Long> {
    @Query("""
            SELECT new com.haeildiary.www.charts.dto.SleepTimeDto(s.bedtime, s.waketime)
            FROM SleepLog s
            WHERE s.user.userId = :userId
                AND s.sleepDate BETWEEN :start AND :end
            """)
    List<SleepTimeDto> findSleepTimeBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
