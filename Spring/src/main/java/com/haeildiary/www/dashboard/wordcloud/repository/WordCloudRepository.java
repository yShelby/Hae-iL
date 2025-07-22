package com.haeildiary.www.dashboard.wordcloud.repository;

import com.haeildiary.www.dashboard.wordcloud.emotion.entity.TestMoodDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WordCloudRepository extends JpaRepository<TestMoodDetailEntity, Long> {

    /*
    // ===================================================================
    // 🚀 향후 단계: 실제 DB 연동을 위한 쿼리 (현재는 주석 처리)
    // ===================================================================
    /**
     * 특정 사용자의 일기에서 추출된 키워드 중, 중요도(percentage)가 높은 상위 15개를 조회
     * @param userId 조회할 사용자의 ID
     * @return MoodDetail 엔티티 리스트
     */
    // @Query("SELECT md FROM TestMoodDetailEntity md JOIN md.diary d WHERE d.user.userId = :userId ORDER BY md.percentage DESC LIMIT 15")
    // List<TestMoodDetailEntity> findTopKeywordsForUser(@Param("userId") Integer userId);
}
