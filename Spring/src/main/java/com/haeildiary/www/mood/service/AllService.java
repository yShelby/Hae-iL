package com.haeildiary.www.mood.service;


import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.mood.dto.FlaskResponseDto;
import com.haeildiary.www.mood.dto.MoodDetailDto;
import com.haeildiary.www.mood.dto.MoodEntryDto;
import com.haeildiary.www.mood.dto.TagDto;
import com.haeildiary.www.mood.entity.MoodEntry;
import com.haeildiary.www.mood.entity.Tag;
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
    public void allEmotion(FlaskResponseDto flaskResult, DiaryEntity diaryEntity) {
        log.info("allEmotion 시작: diaryId={}, flaskResult={}", diaryEntity.getDiaryId(), flaskResult);
        // 1) MoodEntry 저장 (감정 점수 저장)
        MoodEntryDto moodEntryDTO = new MoodEntryDto();
        moodEntryDTO.setDiaryId(diaryEntity.getDiaryId());
        moodEntryDTO.setMoodScore(flaskResult.getMoodScore());
        MoodEntry saveMoodEntry = moodEntryService.saveOrUpdateMoodEntry(moodEntryDTO, diaryEntity);

        // 2) MoodDetail 저장 또는 수정
        List<MoodDetailDto> detailDTOs = flaskResult.getDetails().stream()
                .map(detail -> {
                    MoodDetailDto detailDTO = new MoodDetailDto();
                    detailDTO.setEmotionType(detail.getEmotionType());
                    detailDTO.setPercentage(detail.getPercentage() != null ? detail.getPercentage().intValue() : (int) 0.0);
                    detailDTO.setDiaryId(diaryEntity.getDiaryId());
                    return detailDTO;
                }).toList();
        moodDetailService.saveOrUpdateMoodDetails(detailDTOs, diaryEntity);
        log.debug("MoodDetail 저장 완료 : {} 개", detailDTOs.size());
        // 3) Tag 저장 또는 수정
        List<TagDto> tagDtoList = flaskResult.getTags().stream()
                .map(tagName -> new TagDto(null, tagName /* , 1 */)) // usedCount=1 기본 설정
                .toList();
        // 만약 usedCount를 사용하게 되면 TagService에서 처리하도록 구현 예정
        List<Tag> saveTags = tagService.saveOrUpdateTags(tagDtoList, diaryEntity);
        log.debug("Tag 저장 완료 : {} 개", saveTags.size());

    }
    /**
     * diaryId로 감정 분석 결과 조회
     */
    @Transactional(readOnly = true)
    public FlaskResponseDto findByDiary(Long diaryId) {
        MoodEntry moodEntry = moodEntryService.findByDiaryId(diaryId);
        List<MoodDetailDto> details = moodDetailService.findByDiaryId(diaryId);
        List<String> tagNames = tagService.findTagNamesByDiaryId(diaryId);

        // MoodDetailDTO → FlaskEmotionDetailDTO 변환 호출
        List<FlaskResponseDto.FlaskEmotionDetailDTO> flaskDetails = convertMoodDetailToFlaskDetail(details);
        // FlaskResponseDTO 생성
        return FlaskResponseDto.builder()
                .moodScore(moodEntry.getMoodScore())
                .details(flaskDetails)
                .tags(tagNames)
                .build();
    }
    /**
     * 상세 감정 정보 변환
     */
    private List<FlaskResponseDto.FlaskEmotionDetailDTO> convertMoodDetailToFlaskDetail(List<MoodDetailDto> moodDetailDtos) {
        return moodDetailDtos.stream()
                .map(dto -> new FlaskResponseDto.FlaskEmotionDetailDTO(dto.getEmotionType(), dto.getPercentage().doubleValue()))
                .toList();
    }
}
