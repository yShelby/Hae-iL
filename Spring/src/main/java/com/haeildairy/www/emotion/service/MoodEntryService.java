package com.haeildairy.www.emotion.service;


import com.haeildairy.www.diary.entity.DiaryEntity;
import com.haeildairy.www.emotion.dto.MoodEntryDTO;
import com.haeildairy.www.emotion.entity.MoodEntry;
import com.haeildairy.www.emotion.repository.MoodEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class MoodEntryService {

    // 무드 엔트리 저장소
    private final MoodEntryRepository moodEntryRepository;

    public MoodEntry saveMoodEntry(MoodEntryDTO dto, DiaryEntity diaryEntity) {
        MoodEntry moodEntry = new MoodEntry();
        moodEntry.setDiary(diaryEntity);
        moodEntry.setMoodScore(dto.getMoodScore());

        return moodEntryRepository.save(moodEntry);
    }

}
