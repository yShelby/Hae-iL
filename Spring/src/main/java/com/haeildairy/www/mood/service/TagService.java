package com.haeildairy.www.mood.service;

import com.haeildairy.www.diary.entity.DiaryEntity;
import com.haeildairy.www.mood.dto.TagDTO;
import com.haeildairy.www.mood.entity.Tag;
import com.haeildairy.www.mood.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    // 태그 저장소
    private final TagRepository tagRepository;

    /**
     * 여러 태그 저장 - 일기마다 별도 태그 엔티티 생성
     */
    @Transactional
    public List<Tag> saveOrUpdateTags(List<TagDTO> tagDTOList, DiaryEntity diaryEntity) {
        // 기존 태그 삭제
        tagRepository.deleteByDiaryDiaryId(diaryEntity.getDiaryId());

        // 새 태그 저장
        List<Tag> savedTags = new ArrayList<>();
        for (TagDTO dto : tagDTOList) {
            Tag tag = new Tag();
            tag.setTagName(dto.getTagName());
            tag.setDiary(diaryEntity);
            savedTags.add(tagRepository.save(tag));
        }
        return savedTags;
    }

    /**
     * 해당 일기에 연결된 태그 이름 목록 조회
     */
    public List<String> findTagNamesByDiaryId(Long diaryId) {
        return tagRepository.findTagNamesByDiaryId(diaryId);
    }

}