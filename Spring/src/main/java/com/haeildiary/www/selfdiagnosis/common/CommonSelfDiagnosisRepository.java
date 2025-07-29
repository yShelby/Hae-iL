package com.haeildiary.www.selfdiagnosis.common;

import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

// 불안, 우울, 스트레스를 조회하기 위한 기본 Repository 인터페이스
public interface CommonSelfDiagnosisRepository<T extends CommonStatusAccessor> {

    // 특정 사용자(userId)의 가장 최근 검사 결과 1건 조회, assessment Date 기준 내림차순
    Optional<T> findTopByUserUserIdOrderByAssessmentDateDesc(Integer userId);

    // 특정 사용자(userId)의 특정 연도(year)와 월(month)에 해당하는 검사 결과 조회
    // JPQL 사용
    @Query("SELECT s FROM #{#entityName} s WHERE s.user.userId = :userId " +
            "AND YEAR(s.assessmentDate) = :year AND MONTH(s.assessmentDate) = :month")
    Optional<T> findByUserUserIdAndAssessmentDateYearAndMonth(Integer userId, Integer year, Integer month);

    // PostMapping용: 특정 사용자의 available = true인 검사들 조회 (이전 검사 정리용)
    @Query("SELECT s FROM #{#entityName} s WHERE s.user.userId = :userId AND s.available = true")
    List<T> findByUserUserIdAndAvailableTrue(Integer userId);

    // 스케줄러용: 모든 사용자 ID 조회 (최신 검사를 개별적으로 조회하기 위함)
    @Query("SELECT DISTINCT s.user.userId FROM #{#entityName} s")
    List<Integer> findAllUserIds();

}
