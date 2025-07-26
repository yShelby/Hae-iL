package com.haeildiary.www.selfdiagnosis.common;

import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

// 불안, 우울, 스트레스를 조회하기 위한 기본 Repository 인터페이스
public interface CommonSelfDiagnosisRepository<T extends CommonStatusAccessor> {

    // 특정 사용자(userId)의 가장 최근 검사 결과 1건 조회, assessment Date 기준 내림차순
    Optional<T> findTopByUserUserIdOrderByAssessmentDateDesc(Integer userId);

    // JPQL 사용
    @Query("SELECT s FROM #{#entityName} s WHERE s.user.userId = :userId " +
            "AND YEAR(s.assessmentDate) = :year AND MONTH(s.assessmentDate) = :month")
    // 특정 사용자(userId)의 특정 연도(year)와 월(month)에 해당하는 검사 결과 조회
    Optional<T> findByUserUserIdAndAssessmentDateYearAndMonth(Integer userId, Integer year, Integer month);
}
