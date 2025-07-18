package com.haeildiary.www.mood.service;


import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.mood.dto.MoodDetailDTO;
import com.haeildiary.www.mood.entity.MoodDetail;
import com.haeildiary.www.mood.repository.MoodDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class MoodDetailService {

    // 무드 디테일 저장소
    private final MoodDetailRepository moodDetailRepository;

    @Transactional
    public void saveOrUpdateMoodDetails(List<MoodDetailDTO> dtoList, DiaryEntity diaryEntity) {
        // 기존 데이터 삭제
        moodDetailRepository.deleteByDiaryDiaryId(diaryEntity.getDiaryId());

        // 새 데이터 저장
        for (MoodDetailDTO dto : dtoList) {
            MoodDetail moodDetail = new MoodDetail();
            moodDetail.setDiary(diaryEntity);
            moodDetail.setEmotionType(dto.getEmotionType());
            moodDetail.setPercentage(dto.getPercentage());
            moodDetailRepository.save(moodDetail);
        }
    }

    // 조회용 (diaryId로 MoodDetail 목록 조회)
    public List<MoodDetailDTO> findByDiaryId(Long diaryId) {
        List<MoodDetail> moodDetails = moodDetailRepository.findByDiaryDiaryId(diaryId);
        return moodDetails.stream()
                .map(entity -> {
                    MoodDetailDTO dto = new MoodDetailDTO();
                    dto.setEmotionType(entity.getEmotionType());
                    dto.setPercentage(entity.getPercentage());
                    dto.setDiaryId(diaryId);
                    return dto;
                }).toList();
    }

}