package com.haeildiary.www.mood.repository;


import com.haeildiary.www.calendar.dto.CalendarResponseDto;
import com.haeildiary.www.mood.entity.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {

    Optional<MoodEntry> findByDiaryDiaryId(Long diaryId);

    // 캘린더 : 틀정 기간의 일기 데이터를 감정 점수와 함께 조회
    // LEFT JOIN을 사용하여 MoodEntry가 없는 일기도 조회 가능
    @Query("SELECT new com.haeildiary.www.calendar.dto.CalendarResponseDto(d.diaryId, d.diaryDate, d.title, m.moodScore) " +
        "FROM DiaryEntity d LEFT JOIN d.moodEntry m " +
        "WHERE d.user.userId = :userId AND d.diaryDate BETWEEN :startDate AND :endDate")
    List<CalendarResponseDto> findDiariesWithMoodScoreByDateRange(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // 차트용 데이터 조회
    @Query("""
            SELECT d.diaryDate, m.moodScore
            FROM MoodEntry m JOIN m.diary d
            WHERE d.user.userId = :userId
            AND d.diaryDate BETWEEN :startDate AND :endDate
            ORDER BY d.diaryDate
            """)
    List<Object[]> findMoodScoresForChart(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

}
