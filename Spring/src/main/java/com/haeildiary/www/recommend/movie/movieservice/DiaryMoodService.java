package com.haeildiary.www.recommend.movie.movieservice;

import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.diary.repository.DiaryRepository;
import com.haeildiary.www.mood.entity.MoodDetail;
import com.haeildiary.www.mood.repository.MoodDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DiaryMoodService {

    private final DiaryRepository diaryRepository;
    private final MoodDetailRepository moodDetailRepository;

    // 1. 오늘 일기 조회
    public Optional<DiaryEntity> getTodayDiary(Integer userID) {
        return diaryRepository.findByUserUserIdAndDiaryDate(userID, LocalDate.now());
    }
    // 2. 감정 리스트 가져오기
    public List<MoodDetail> getMoodDetails(Long diaryId) {
        return moodDetailRepository.findByDiaryDiaryId(diaryId);
    }

}
