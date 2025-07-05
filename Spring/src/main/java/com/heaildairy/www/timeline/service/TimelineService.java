package com.heaildairy.www.timeline.service;

import com.heaildairy.www.diary.repository.DiaryRepository;
import com.heaildairy.www.health.dto.ExerciseLogDto;
import com.heaildairy.www.health.dto.MealLogDto;
import com.heaildairy.www.health.dto.SleepLogDto;
import com.heaildairy.www.health.repository.ExerciseLogRepository;
import com.heaildairy.www.health.repository.MealLogRepository;
import com.heaildairy.www.health.repository.SleepLogRepository;
import com.heaildairy.www.timeline.dto.TimelineDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimelineService {

    private final DiaryRepository diaryRepository;
    private final ExerciseLogRepository exerciseLogRepository;
    private final MealLogRepository mealLogRepository;
    private final SleepLogRepository sleepLogRepository;

    // ✅ 단일 날짜 조회 (기존)
    public List<TimelineDto> getTimelineByDate(Integer userId, LocalDate date) {
        List<TimelineDto> timeline = new ArrayList<>();

        exerciseLogRepository.findByUserUserIdAndExerciseDate(userId, date)
                .ifPresent(exercise -> timeline.add(TimelineDto.fromExerciseLog(exercise)));

        mealLogRepository.findByUserUserIdAndMealDate(userId, date)
                .ifPresent(meal -> timeline.add(TimelineDto.fromMealLog(meal)));

        sleepLogRepository.findByUserUserIdAndSleepDate(userId, date)
                .ifPresent(sleep -> timeline.add(TimelineDto.fromSleepLog(sleep)));

        return timeline;
    }

    // ✅ 주간 타임라인 조회 추가
    public List<TimelineDto> getTimelineByDateRange(Integer userId, LocalDate start, LocalDate end) {
        System.out.println("🧪 getTimelineByDateRange 실행");
        System.out.println("UserId = " + userId + ", start = " + start + ", end = " + end);
        List<TimelineDto> timeline = new ArrayList<>();

        // ✅ 일기
        diaryRepository.findAllByUserUserIdAndDiaryDateBetween(userId, start, end)
                .forEach(diary -> timeline.add(TimelineDto.fromDiary(diary)));

        var exerciseList = exerciseLogRepository.findAllByUserUserIdAndExerciseDateBetween(userId, start, end);
//        System.out.println("🏋️ 운동 기록 개수: " + exerciseList.size());
        exerciseList.forEach(exercise -> timeline.add(TimelineDto.fromExerciseLog(exercise)));

        var mealList = mealLogRepository.findAllByUserUserIdAndMealDateBetween(userId, start, end);
//        System.out.println("🍽️ 식사 기록 개수: " + mealList.size());
        mealList.forEach(meal -> timeline.add(TimelineDto.fromMealLog(meal)));

        var sleepList = sleepLogRepository.findAllByUserUserIdAndSleepDateBetween(userId, start, end);
//        System.out.println("🛌 수면 기록 개수: " + sleepList.size());
        sleepList.forEach(sleep -> timeline.add(TimelineDto.fromSleepLog(sleep)));

        return timeline;
    }
}
