package com.heaildairy.www.dashboard.todolist.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.dashboard.todolist.entity.TodoListEntity;
import com.heaildairy.www.dashboard.todolist.repository.TodoListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodoListService {

    private final TodoListRepository todoListRepository;
    private final UserRepository userRepository;

    /**
     * 오늘의 미션 완료 상태 조회
     * @param userId Controller에서 추출한 현재 로그인된 사용자의 ID
     * @return 각 미션의 완료 여부를 담은 Map<String, Boolean> 객체
     */
    public Map<String, Boolean> getTodayTodoStatus(Integer userId) {
        LocalDate today = LocalDate.now();

        // 1. [데이터 조회] 오늘 날짜에 해당하는 사용자의 모든 '오늘의 미션' 목록을 DB에서 가져온다
        List<TodoListEntity> todayTodos = todoListRepository.findByUser_UserIdAndTodoDate(userId, today);

        // 2. [데이터 가공] 조회된 목록(List)을 스트림을 사용해 "Map<미션ID, 완료여부>" 형태로 변환
        Map<String, Boolean> statusMap = todayTodos.stream()
                .collect(Collectors.toMap(
                        TodoListEntity::getActivityType,
                        TodoListEntity::isCompleted
                ));

        // 3. [기본값 설정] DB에 기록이 없는 미션에 대해 기본값으로 'false'를 설정
        List<String> allMissionTypes = Arrays.asList("diary", "sleep", "exercise", "meal", "journaling");
        allMissionTypes.forEach(type -> statusMap.putIfAbsent(type, false));

        return statusMap;
    }

    /**
     * 특정 미션을 완료 상태로 처리하고 데이터베이스에 기록하는 메소드
     * @param userId       현재 로그인한 사용자의 ID
     * @param activityType 완료 처리할 미션의 종류 (e.g., "diary", "exercise")
     */
    @Transactional
    public void markAsCompleted(Integer userId, String activityType) {
        LocalDate today = LocalDate.now();

        // 오늘 날짜로 해당 활동이 이미 저장되어 있는지 확인
        Optional<TodoListEntity> existingTodo = todoListRepository.findByUser_UserIdAndActivityTypeAndTodoDate(userId, activityType, today);

        if (existingTodo.isPresent()) {
            // 이미 존재하면 완료 상태만 true로 업데이트합니다. (중복 저장 방지)
            TodoListEntity todo = existingTodo.get();
            if (!todo.isCompleted()) {
                todo.updateCompletion(true);
            }
        } else {
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다: " + userId));

            TodoListEntity newTodo = TodoListEntity.builder()
                    .user(user)
                    .activityType(activityType)
                    .isCompleted(true)
                    .todoDate(today)
                    .build();
            todoListRepository.save(newTodo);
        }
    }
}
