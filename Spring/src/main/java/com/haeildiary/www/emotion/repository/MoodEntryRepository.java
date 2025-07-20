<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/repository/MoodEntryRepository.java
package com.haeildiary.www.emotion.repository;

import com.haeildiary.www.calendar.dto.CalendarResponseDto;
import com.haeildiary.www.emotion.entity.MoodEntry;
========
package com.haeildairy.www.emotion.repository;

import com.haeildairy.www.calendar.dto.CalendarResponseDto;
import com.haeildairy.www.emotion.entity.MoodEntry;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/repository/MoodEntryRepository.java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {

    // 캘린더: 특정 기간의 일기 데이터를 감정 점수와 함께 조회
    // LEFT JOIN을 사용하여 MoodEntry가 없는 일기도 조회 가능
<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/repository/MoodEntryRepository.java
    @Query("SELECT new com.haeildiary.www.calendar.dto.CalendarResponseDto(d.diaryId, d.diaryDate, d.title, m.moodScore) " +
========
    @Query("SELECT new com.haeildairy.www.calendar.dto.CalendarResponseDto(d.diaryId, d.diaryDate, d.title, m.moodScore) " +
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/repository/MoodEntryRepository.java
           "FROM DiaryEntity d LEFT JOIN d.moodEntry m " +
           "WHERE d.user.userId = :userId AND d.diaryDate BETWEEN :startDate AND :endDate")
    List<CalendarResponseDto> findDiariesWithMoodScoreByDateRange(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}