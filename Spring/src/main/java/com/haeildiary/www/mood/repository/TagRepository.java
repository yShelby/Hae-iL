package com.haeildiary.www.mood.repository;

import com.haeildiary.www.dashboard.wordcloud.dto.TagCountDto;
import com.haeildiary.www.mood.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    // diaryId로 태그 이름 리스트 조회
    @Query("SELECT t.tagName FROM Tag t WHERE t.diary.diaryId = :diaryId")
    List<String> findTagNamesByDiaryId(@Param("diaryId") Long diaryId);
    void deleteByDiaryDiaryId(Long diaryId);

    // [추가]
    // 특정 사용자의 모든 태그를 이름별로 그룹화하고, 각 태그의 빈도수를 계산하여 반환
    // JPQL의 'new' 키워드를 사용하여 조회 결과를 즉시 TagCountDto 객체로 매핑
    // 빈도수가 많은 순으로 정렬하여 워드클라우드에서 단어 크기를 비례적으로 표시하기 용이
    @Query("SELECT new com.haeildiary.www.dashboard.wordcloud.dto.TagCountDto(t.tagName, COUNT(t.tagName)) " +
            "FROM Tag t " +
            "WHERE t.diary.user.userId = :userId " +
            "GROUP BY t.tagName " +
            "ORDER BY COUNT(t.tagName) DESC")
    List<TagCountDto> countTagsByUserId(@Param("userId") Integer userId);
}
