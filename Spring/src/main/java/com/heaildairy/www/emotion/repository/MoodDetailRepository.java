package com.heaildairy.www.emotion.repository;

import com.heaildairy.www.emotion.entity.MoodDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MoodDetailRepository extends JpaRepository<MoodDetail, Long> {
    List<MoodDetail> findByDiaryDiaryId(Long diaryId);
    void deleteByDiaryDiaryId(Long diaryId);
}
