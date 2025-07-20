package com.haeildiary.www.emotion.service;


import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.emotion.dto.MoodDetailDTO;
import com.haeildiary.www.emotion.entity.MoodDetail;
import com.haeildiary.www.emotion.repository.MoodDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class MoodDetailService {

    // 무드 디테일 저장소
    private final MoodDetailRepository moodDetailRepository;

    public void saveMoodDetail(List<MoodDetailDTO> dtoList, DiaryEntity diaryEntity) {
        System.out.println("saveMoodDetail 호출: " + dtoList.size() + "개의 MoodDetailDTO 저장");
        for (MoodDetailDTO dto : dtoList) {
            MoodDetail moodDetail = new MoodDetail();
            moodDetail.setDiary(diaryEntity);
            moodDetail.setEmotionType(dto.getEmotionType());
            moodDetail.setPercentage(dto.getPercentage());
            moodDetail.setConfidenceScore(dto.getConfidenceScore());

            moodDetailRepository.save(moodDetail);
        }
    }

}