package com.heaildairy.www.dashboard.question.repository;

import com.heaildairy.www.dashboard.question.entity.DailyQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface DailyQuestionRepository extends JpaRepository<DailyQuestionEntity, Integer> {

    /**
     * DB에 저장된 모든 질문의 개수를 반환
     * Spring Data JPA에서 count() 메서드는 기본적으로 long을 반환하도록 설계됨
     * 따라서 Integer 사용 불가
     */
    long count();

    /**
     * 특정 순번(offset)에 해당하는 질문 하나를 조회
     * 질문을 순서대로 가져오기 위해 네이티브 쿼리를 사용 가능
     * @param offset 가져올 질문의 순서 (0부터 시작)
     * @return DailyQuestion 엔티티
     */
    @Query(value = "SELECT * FROM daily_question ORDER BY question_id LIMIT 1 OFFSET :offset", nativeQuery = true)
    DailyQuestionEntity findOneByOffset(@Param("offset") long offset);

    /**
     * 오늘 날짜 기준으로 질문이 존재하는지 여부를 반환
     * @param date 확인할 날짜
     * @return 존재하면 true, 없으면 false
     */
//    boolean existsByDate(LocalDate date);
}
