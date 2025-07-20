<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/health/repository/SleepLogRepository.java
package com.haeildiary.www.health.repository;

import com.haeildiary.www.health.entity.SleepLog;
========
package com.haeildairy.www.health.repository;

import com.haeildairy.www.health.entity.SleepLog;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/health/repository/SleepLogRepository.java
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
