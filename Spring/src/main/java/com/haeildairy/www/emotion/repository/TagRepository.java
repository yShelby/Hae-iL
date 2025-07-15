package com.haeildairy.www.emotion.repository;

import com.haeildairy.www.emotion.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    // diaryId로 태그 이름 리스트 조회
    @Query("SELECT t.tagName FROM Tag t WHERE t.diary.diaryId = :diaryId")
    List<String> findTagNamesByDiaryId(@Param("diaryId") Long diaryId);
    void deleteByDiaryDiaryId(Long diaryId);
}
