<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/timeline/service/TimelineService.java
package com.haeildiary.www.timeline.service;

import com.haeildiary.www.diary.repository.DiaryRepository;
import com.haeildiary.www.health.repository.ExerciseLogRepository;
import com.haeildiary.www.health.repository.MealLogRepository;
import com.haeildiary.www.health.repository.SleepLogRepository;
import com.haeildiary.www.timeline.dto.TimelineDto;
========
package com.haeildairy.www.timeline.service;

import com.haeildairy.www.diary.repository.DiaryRepository;
import com.haeildairy.www.health.repository.ExerciseLogRepository;
import com.haeildairy.www.health.repository.MealLogRepository;
import com.haeildairy.www.health.repository.SleepLogRepository;
import com.haeildairy.www.timeline.dto.TimelineDto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/timeline/service/TimelineService.java
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

    // ✅ 주간 타임라인 조회 추가
    public List<TimelineDto> getTimelineByDateRange(Integer userId, LocalDate start, LocalDate end) {
        List<TimelineDto> timeline = new ArrayList<>();

        // ✅ 일기
        diaryRepository.findAllByUserUserIdAndDiaryDateBetween(userId, start, end)
                .forEach(diary -> timeline.add(TimelineDto.fromDiary(diary)));

        var exerciseList = exerciseLogRepository.findAllByUserUserIdAndExerciseDateBetween(userId, start, end);
        exerciseList.forEach(exercise -> timeline.add(TimelineDto.fromExerciseLog(exercise)));

        var mealList = mealLogRepository.findAllByUserUserIdAndMealDateBetween(userId, start, end);
        mealList.forEach(meal -> timeline.add(TimelineDto.fromMealLog(meal)));

        var sleepList = sleepLogRepository.findAllByUserUserIdAndSleepDateBetween(userId, start, end);
        sleepList.forEach(sleep -> timeline.add(TimelineDto.fromSleepLog(sleep)));

        return timeline;
    }
}
