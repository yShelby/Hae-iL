package com.heaildairy.www.dashboard.question.repository;

import com.heaildairy.www.dashboard.question.entity.DailyAnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyAnswerRepository extends JpaRepository<DailyAnswerEntity, Integer> {

    /**
     * 특정 사용자가 특정 날짜에 작성한 답변을 조회
     * @param userId 사용자 ID
     * @param date 조회할 날짜
     * @return Optional<DailyAnswerEntity>
     */
    Optional<DailyAnswerEntity> findByUser_UserIdAndAnswerDate(Integer userId, LocalDate date);
}
