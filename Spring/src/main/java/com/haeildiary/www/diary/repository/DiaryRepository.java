package com.haeildiary.www.diary.repository;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.diary.entity.DiaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 📦 DiaryRepository.java
 * ──────────────────────────────
 * ✅ 역할:
 * - DiaryEntity에 대한 DB 접근 및 CRUD 작업을 담당하는 JPA Repository 인터페이스
 * - 사용자(userId)와 날짜(diaryDate)를 기준으로 일기 조회 및 활성 일자 리스트 조회 기능 제공
 *
 * 📊 데이터 흐름도
 * 1️⃣ 서비스 레이어가 DiaryRepository 메서드 호출하여 데이터 조회 요청
 * 2️⃣ DiaryEntity 데이터를 DB에서 조회하여 Optional 또는 리스트로 반환
 * 3️⃣ 반환된 데이터를 서비스에서 가공 후 컨트롤러에 전달
 */

public interface DiaryRepository extends JpaRepository<DiaryEntity, Long> {

    /**
     * 🔍 findByUserUserIdAndDiaryDate
     * - 특정 사용자(userId)와 특정 날짜(diaryDate)에 해당하는 일기 단건 조회
     * - Optional로 반환하여 존재 여부를 명확히 표현
     */
    Optional<DiaryEntity> findByUserUserIdAndDiaryDate(Integer userId, LocalDate diaryDate);

    /**
     * 📅 findActiveDatesByUserIdAndYearMonth
     * - 특정 사용자(userId)의 특정 연도(year) 및 월(month)에 작성된 일기의 작성 날짜 목록 조회
     * - DISTINCT를 사용해 중복 날짜 제거
     * - @Query 어노테이션 내 JPQL로 직접 쿼리 작성
     * - @Param 어노테이션으로 메서드 파라미터와 JPQL 변수 바인딩
     */
    @Query("SELECT DISTINCT d.diaryDate FROM DiaryEntity d WHERE d.user.userId = :userId AND YEAR(d.diaryDate) = :year AND MONTH(d.diaryDate) = :month")
    List<LocalDate> findActiveDatesByUserIdAndYearMonth(@Param("userId") Integer userId, @Param("year") int year, @Param("month") int month);

    // ✅ 주간 타임라인: 날짜 범위로 다이어리 전체 조회
    List<DiaryEntity> findAllByUserUserIdAndDiaryDateBetween(Integer userId, LocalDate start, LocalDate end);

    // 추가 - dashboardCount를 위한 사용자의 전체 일기 개수를 세는 메소드
    long countByUser(UserEntity user);

    /**
     * 추가 - 특정 사용자와 기간에 해당하는 모든 일기 작성 날짜를 중복 없이 조회
     * JPQL(Java Persistence Query Language)을 사용하여 필요한 날짜(localDate) 데이터만 효율적으로 가져온다
     * @param userId User의 ID
     * @param startDate 조회 시작일
     * @param endDate 조회 종료일
     * @return 날짜 목록 (List<LocalDate>)
     */
    @Query("SELECT DISTINCT d.diaryDate FROM DiaryEntity d WHERE d.user.userId = :userId AND d.diaryDate BETWEEN :startDate AND :endDate")
    List<LocalDate> findDistinctByUserIdAndDateBetween(
            @Param("userId") Integer userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // 추가 - 특정 사용자가 특정 날짜에 일기를 작성했는지 확인하는 메서드
    boolean existsByUser_UserIdAndDiaryDate(Integer userId, LocalDate date);
}
