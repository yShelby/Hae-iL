package com.heaildairy.www.dashboard.todolist.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.dashboard.todolist.service.TodoListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/todolist")
@RequiredArgsConstructor
public class TodoListController {

    private final TodoListService todoListService;

    /**
     * 오늘의 미션 완료 상태를 조회하는 API
     * @param customUser Spring Security가 주입해주는 현재 로그인된 사용자의 상세 정보
     * @return 각 미션의 완료 여부를 담은 Map 객체
     */
    @GetMapping("/today")
    public ResponseEntity<Map<String, Boolean>> getTodayTodoStatus(@AuthenticationPrincipal CustomUser customUser) {
        Integer userId = customUser.getUserId();
        Map<String, Boolean> status = todoListService.getTodayTodoStatus(userId);
        return ResponseEntity.ok(status);
    }
}