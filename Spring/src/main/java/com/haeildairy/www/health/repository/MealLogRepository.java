package com.haeildairy.www.health.repository;

import com.haeildairy.www.health.entity.MealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealLogRepository extends JpaRepository<MealLog, Long> {

    Optional<MealLog> findByUserUserIdAndMealDate(Integer userId, LocalDate mealDate);
    @Query("SELECT m.mealDate FROM MealLog m WHERE m.user.userId = :userId AND FUNCTION('YEAR', m.mealDate) = :year AND FUNCTION('MONTH', m.mealDate) = :month")
    List<LocalDate> findActiveDatesByUserIdAndYearMonth(@Param("userId") Integer userId,
                                                        @Param("year") int year,
                                                        @Param("month") int month);

    List<MealLog> findAllByUserUserIdAndMealDateBetween(Integer userId, LocalDate start, LocalDate end);
}
