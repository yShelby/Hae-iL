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

    private final MoodDetailService moodDetailService;
    private final MoodEntryService moodEntryService;
    private final TagService tagService;
    /**
     * 감정 분석 전체 처리 (감정 점수 + 상세 + 태그 저장)
     * - 이미 데이터가 존재하면 update 처리
     */
    @Transactional
    public void allEmotion(FlaskResponseDTO flaskResult, DiaryEntity diaryEntity) {
        log.info("allEmotion 시작: diaryId={}, flaskResult={}", diaryEntity.getDiaryId(), flaskResult);
        // 1) MoodEntry 저장 (감정 점수 저장)
        MoodEntryDTO moodEntryDTO = new MoodEntryDTO();
        moodEntryDTO.setDiaryId(diaryEntity.getDiaryId());
        moodEntryDTO.setMoodScore(flaskResult.getMoodScore());
        MoodEntry saveMoodEntry = moodEntryService.saveOrUpdateMoodEntry(moodEntryDTO, diaryEntity);

        // 2) MoodDetail 저장 또는 수정
        List<MoodDetailDTO> detailDTOs = flaskResult.getDetails().stream()
                .map(detail -> {
                    MoodDetailDTO detailDTO = new MoodDetailDTO();
                    detailDTO.setEmotionType(detail.getEmotionType());
                    detailDTO.setPercentage(detail.getPercentage() != null ? detail.getPercentage().intValue() : (int) 0.0);
                    detailDTO.setDiaryId(diaryEntity.getDiaryId());
                    return detailDTO;
                }).toList();
        moodDetailService.saveOrUpdateMoodDetails(detailDTOs, diaryEntity);
        log.debug("MoodDetail 저장 완료 : {} 개", detailDTOs.size());
        // 3) Tag 저장 또는 수정
        List<TagDTO> tagDTOList = flaskResult.getTags().stream()
                .map(tagName -> new TagDTO(null, tagName /* , 1 */)) // usedCount=1 기본 설정
                .toList();
        // 만약 usedCount를 사용하게 되면 TagService에서 처리하도록 구현 예정
        List<Tag> saveTags = tagService.saveOrUpdateTags(tagDTOList, diaryEntity);
        log.debug("Tag 저장 완료 : {} 개", saveTags.size());

    }
    /**
     * diaryId로 감정 분석 결과 조회
     */
    @Transactional(readOnly = true)
    public FlaskResponseDTO findByDiary(Long diaryId) {
        MoodEntry moodEntry = moodEntryService.findByDiaryId(diaryId);
        List<MoodDetailDTO> details = moodDetailService.findByDiaryId(diaryId);
        List<String> tagNames = tagService.findTagNamesByDiaryId(diaryId);

        // MoodDetailDTO → FlaskEmotionDetailDTO 변환 호출
        List<FlaskResponseDTO.FlaskEmotionDetailDTO> flaskDetails = convertMoodDetailToFlaskDetail(details);
        // FlaskResponseDTO 생성
        return FlaskResponseDTO.builder()
                .moodScore(moodEntry.getMoodScore())
                .details(flaskDetails)
                .tags(tagNames)
                .build();
    }
    /**
     * 상세 감정 정보 변환
     */
    private List<FlaskResponseDTO.FlaskEmotionDetailDTO> convertMoodDetailToFlaskDetail(List<MoodDetailDTO> moodDetailDTOs) {
        return moodDetailDTOs.stream()
                .map(dto -> new FlaskResponseDTO.FlaskEmotionDetailDTO(dto.getEmotionType(), dto.getPercentage().doubleValue()))
                .toList();
    }
}
