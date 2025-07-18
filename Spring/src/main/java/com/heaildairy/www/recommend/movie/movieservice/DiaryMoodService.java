package com.heaildairy.www.recommend.movie.movieservice;

import com.heaildairy.www.diary.entity.DiaryEntity;
import com.heaildairy.www.diary.repository.DiaryRepository;
import com.heaildairy.www.emotion.entity.MoodDetail;
import com.heaildairy.www.emotion.repository.MoodDetailRepository;
import com.heaildairy.www.recommend.movie.movierepository.DisLikeMoviesRepository;
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
