package com.haeildiary.www.dashboard.todolist.repository;

import com.haeildiary.www.dashboard.todolist.entity.TodoListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TodoListRepository extends JpaRepository<TodoListEntity, Long> {

    // ✅ 사용자(userId)와 날짜(todoDate)에 해당하는 모든 할 일 목록 조회
    List<TodoListEntity> findByUser_UserIdAndTodoDate(Integer userId, LocalDate date);

    // ✅ 사용자(userId), 활동 유형(activityType), 날짜(todoDate)에 해당하는 단일 할 일 조회 (Optional로 존재 여부 확인 가능)
    Optional<TodoListEntity> findByUser_UserIdAndActivityTypeAndTodoDate(Integer userId, String activityType, LocalDate date);
}
