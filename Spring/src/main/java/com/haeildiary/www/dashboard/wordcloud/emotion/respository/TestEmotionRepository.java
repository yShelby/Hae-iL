package com.haeildiary.www.dashboard.wordcloud.emotion.respository;

import com.haeildiary.www.dashboard.wordcloud.emotion.entity.TestMoodDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestEmotionRepository extends JpaRepository<TestMoodDetailEntity, Long> {
}
