package com.heaildairy.www.dashboard.question.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.dashboard.question.dto.QuestionDto;
import com.heaildairy.www.dashboard.question.service.DailyQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/question")
@RequiredArgsConstructor
public class DailyQuestionController {

    private final DailyQuestionService questionService;

    /**
     *  오늘의 질문을 랜덤으로 조회하는 API
     * @return 랜덤 질문 DTO
     */
    @GetMapping("/today")
    public ResponseEntity<QuestionDto> getRandomQuestion() {
        QuestionDto dto = questionService.getRandomQuestion();
        return ResponseEntity.ok(dto);
    }
}
