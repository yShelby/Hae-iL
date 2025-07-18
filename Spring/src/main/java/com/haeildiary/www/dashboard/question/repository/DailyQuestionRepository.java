package com.haeildiary.www.dashboard.question.repository;

import com.haeildiary.www.dashboard.question.entity.DailyQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface DailyQuestionRepository extends JpaRepository<DailyQuestionEntity, Integer> {

    /**
     * DB에서 질문 하나를 랜덤으로 조회
     * ORDER BY RAND() 또는 RAND() 함수를 사용하여 무작위 정렬 후 첫 번째 결과를 가져온다.
     * (참고: DB 종류에 따라 RAND() 함수명이 다를 수 있습니다. MariaDB/MySQL 기준)
     * @return Optional<DailyQuestionEntity>
     */
    @Query(value = "SELECT * FROM daily_question ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<DailyQuestionEntity> findRandomQuestion();
}
