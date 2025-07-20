<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/service/MoodEntryService.java
package com.haeildiary.www.emotion.service;


import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.emotion.dto.MoodEntryDTO;
import com.haeildiary.www.emotion.entity.MoodEntry;
import com.haeildiary.www.emotion.repository.MoodEntryRepository;
========
package com.haeildairy.www.emotion.service;


import com.haeildairy.www.diary.entity.DiaryEntity;
import com.haeildairy.www.emotion.dto.MoodEntryDTO;
import com.haeildairy.www.emotion.entity.MoodEntry;
import com.haeildairy.www.emotion.repository.MoodEntryRepository;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/service/MoodEntryService.java
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
