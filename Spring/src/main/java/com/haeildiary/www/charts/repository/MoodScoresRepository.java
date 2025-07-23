package com.haeildiary.www.charts.repository;

import com.haeildiary.www.charts.dto.MoodScoresDto;
import com.haeildiary.www.mood.entity.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MoodEntryScoresRepository extends JpaRepository<MoodEntry, Long> {
    @Query("SELECT new com.haeildiary.www.charts.dto.MoodScoresDto(d.diaryDate, m.moodScore)" +
            "From MoodEntry m JOIN m.diary d" +
            "WHERE d.user.userID = :userID AND d.diaryDate BETWEEN :start AND :end")
    List<MoodScoresDto> findMoodScoresBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
