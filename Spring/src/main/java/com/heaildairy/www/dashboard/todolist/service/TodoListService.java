package com.heaildairy.www.dashboard.todolist.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.dashboard.todolist.entity.TodoListEntity;
import com.heaildairy.www.diary.repository.DiaryRepository;
import com.heaildairy.www.health.repository.ExerciseLogRepository;
import com.heaildairy.www.health.repository.MealLogRepository;
import com.heaildairy.www.health.repository.SleepLogRepository;
import com.heaildairy.www.journal.repository.JournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodoListService {

    private final MealLogRepository mealLogRepository;
    private final ExerciseLogRepository exerciseLogRepository;
    private final SleepLogRepository sleepLogRepository;
    private final DiaryRepository diaryRepository;
    private final JournalRepository journalRepository;

    // 오늘의 미션 완료 상태 조회
    // 파라미터로 Controller에서 추출한 Integer 타입의 userId를 받는다.
    public Map<String, Boolean> getTodayTodoStatus(Integer userId) {
        LocalDate today = LocalDate.now();
        Map<String, Boolean> statusMap = new HashMap<>();

        // 각 기록 테이블의 존재 여부만 순수하게 확인
        statusMap.put("diary", diaryRepository.existsByUser_UserIdAndDiaryDate(userId, today));
        statusMap.put("journaling", journalRepository.existsByUser_UserIdAndJournalDate(userId, today));
        statusMap.put("exercise", exerciseLogRepository.findByUserUserIdAndExerciseDate(userId, today).isPresent());
        statusMap.put("meal", mealLogRepository.findByUserUserIdAndMealDate(userId, today).isPresent());
        statusMap.put("sleep", sleepLogRepository.findByUserUserIdAndSleepDate(userId, today).isPresent());

        return statusMap;
    }
}
