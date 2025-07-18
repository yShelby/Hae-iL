package com.heaildairy.www.mood.repository;

import com.heaildairy.www.mood.entity.MoodDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MoodDetailRepository extends JpaRepository<MoodDetail, Long> {
    List<MoodDetail> findByDiaryDiaryId(Long diaryId);
    void deleteByDiaryDiaryId(Long diaryId);
}
