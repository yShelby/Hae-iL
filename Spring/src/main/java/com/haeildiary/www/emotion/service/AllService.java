package com.haeildiary.www.emotion.service;


import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.emotion.dto.FlaskResponseDTO;
import com.haeildiary.www.emotion.dto.MoodDetailDTO;
import com.haeildiary.www.emotion.dto.MoodEntryDTO;
import com.haeildiary.www.emotion.dto.TagDTO;
import com.haeildiary.www.emotion.entity.MoodEntry;
import com.haeildiary.www.emotion.entity.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AllService {
    //
    private final MoodDetailService moodDetailService;
    private final MoodEntryService moodEntryService;
    private final TagService tagService;

    @Transactional
    public void allEmotion(FlaskResponseDTO flaskResult, DiaryEntity diaryEntity) {
        log.info("allEmotion 시작: diaryId={}, flaskResult={}", diaryEntity.getDiaryId(), flaskResult);

        MoodEntryDTO moodEntryDTO = new MoodEntryDTO();
        moodEntryDTO.setDiaryId(diaryEntity.getDiaryId());
        moodEntryDTO.setMoodScore(flaskResult.getMoodScore());
        MoodEntry saveMoodEntry = moodEntryService.saveMoodEntry(moodEntryDTO, diaryEntity);
//        DiaryEntity diaryEntity =


        List<MoodDetailDTO> detailDTOs = flaskResult.getDetails().stream()
                .map(detail -> {
                    MoodDetailDTO detailDTO = new MoodDetailDTO();
                    detailDTO.setEmotionType(detail.getEmotionType());
                    detailDTO.setPercentage(detail.getPercentage() != null ? detail.getPercentage().intValue() : (int) 0.0);
                    detailDTO.setConfidenceScore(null);
                    detailDTO.setDiaryId(diaryEntity.getDiaryId());
                    return detailDTO;
                }).toList();
        moodDetailService.saveMoodDetail(detailDTOs, diaryEntity);
        log.debug("MoodDetail 저장 완료 : {} 개", detailDTOs.size());

        List<TagDTO> tagDTOList = flaskResult.getTags().stream()
                .map(tagName -> new TagDTO(null, tagName, 1)) // usedCount=1 기본 설정
                .toList();

        List<Tag> saveTags = tagService.saveTag(tagDTOList);
        log.debug("Tag 저장 완료 : {} 개", saveTags.size());

    }
}
