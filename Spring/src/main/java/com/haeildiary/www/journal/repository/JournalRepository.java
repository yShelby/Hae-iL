package com.haeildiary.www.journal.repository;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.journal.entity.Category;
import com.haeildiary.www.journal.entity.JournalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface JournalRepository extends JpaRepository<JournalEntity, Long> {
    /**
     * 주어진 사용자 ID와 카테고리에 해당하는 일기 목록을 작성일(createdAt) 내림차순으로 조회하는 쿼리 메서드.
     *
     * @param userId 조회할 사용자의 고유 ID
     * @param category 조회할 일기의 카테고리
     * @return 해당 사용자와 카테고리에 맞는 일기 리스트
     */
    @Query("SELECT j FROM JournalEntity j WHERE j.user.userId = :userId " +
            "AND j.category = :category ORDER BY j.createdAt DESC")
    List<JournalEntity> findJournalsByCategory(@Param("userId") Integer userId, @Param("category") Category category);

    /**
     * 주어진 사용자 ID에 해당하는 모든 일기 목록을 작성일(createdAt) 내림차순으로 조회하는 쿼리 메서드.
     *
     * @param userId 조회할 사용자의 고유 ID
     * @return 해당 사용자의 모든 일기 리스트
     */
    @Query("SELECT j FROM JournalEntity j WHERE j.user.userId = :userId ORDER BY j.createdAt DESC")
    List<JournalEntity> findAllJournals(@Param("userId") Integer userId);

    // 추가 - dashboardCount를 위한 사용자의 전체 저널(리뷰) 개수를 세는 메소드
    long countByUser(UserEntity user);

    /**
     * 추가 - 특정 사용자와 기간에 해당하는 모든 저널 작성 날짜를 중복 없이 조회합
     * @param userId User의 ID
     * @param startDate 조회 시작일
     * @param endDate 조회 종료일
     * @return 날짜 목록 (List<LocalDate>)
     */
    @Query("SELECT DISTINCT j.journalDate FROM JournalEntity j WHERE j.user.userId = :userId AND j.journalDate BETWEEN :startDate AND :endDate")
    List<LocalDate> findDistinctByUserIdAndDateBetween(@Param("userId") Integer userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // 추가 - 특정 사용자가 특정 날짜에 저널을 작성했는지 확인하는 메서드
    boolean existsByUser_UserIdAndJournalDate(Integer userId, LocalDate date);
}
