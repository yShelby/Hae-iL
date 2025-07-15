package com.heaildairy.www.emotion.service;


import com.heaildairy.www.diary.entity.DiaryEntity;
import com.heaildairy.www.emotion.dto.MoodEntryDTO;
import com.heaildairy.www.emotion.entity.MoodEntry;
import com.heaildairy.www.emotion.repository.MoodEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class MoodEntryService {

    // 무드 엔트리 저장소
    private final MoodEntryRepository moodEntryRepository;

    public MoodEntry saveOrUpdateMoodEntry(MoodEntryDTO dto, DiaryEntity diaryEntity) {
        // diaryId로 기존 데이터 조회
        MoodEntry existing = moodEntryRepository.findByDiaryDiaryId(diaryEntity.getDiaryId()).orElse(null);
        if (existing != null) {
            // 기존 엔티티가 있으면 moodScore 업데이트
            existing.setMoodScore(dto.getMoodScore());
            return moodEntryRepository.save(existing);
        } else {
            // 없으면 새로 생성
            MoodEntry moodEntry = new MoodEntry();
            moodEntry.setDiary(diaryEntity);
            moodEntry.setMoodScore(dto.getMoodScore());
            return moodEntryRepository.save(moodEntry);
        }
    }

    // 조회용 (diaryId로 MoodEntry 조회)
    public MoodEntry findByDiaryId(Long diaryId) {
        return moodEntryRepository.findByDiaryDiaryId(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("MoodEntry not found for diaryId: " + diaryId));
    }
}
