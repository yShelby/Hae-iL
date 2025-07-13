package com.heaildairy.www.dashboard.question.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.dashboard.question.dto.QuestionAnswerDto;
import com.heaildairy.www.dashboard.question.dto.SaveAnswerRequestDto;
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
     * 오늘의 질문과 답변을 조회하는 API
     */
    @GetMapping("/today")
    public ResponseEntity<QuestionAnswerDto> getTodayQuestionAndAnswer(@AuthenticationPrincipal CustomUser customUser) {
        Integer userId = customUser.getUserId();
        QuestionAnswerDto dto = questionService.getTodayQuestionAndAnswer(userId);
        return ResponseEntity.ok(dto);
    }

    /**
     * 오늘의 질문에 대한 답변을 저장/수정하는 API
     */
    @PostMapping("/answer")
    public ResponseEntity<Void> saveAnswer(@AuthenticationPrincipal CustomUser customUser, @RequestBody SaveAnswerRequestDto request) {
        Integer userId = customUser.getUserId();
        questionService.saveOrUpdateAnswer(userId, request.getAnswerText());
        return ResponseEntity.ok().build();
    }

    /**
     * 오늘의 질문에 대한 답변을 삭제하는 API
     * @param customUser 현재 로그인한 사용자 정보
     * @return 성공 시 204 No Content
     */
    @DeleteMapping("/answer")
    public ResponseEntity<Void> deleteAnswer(@AuthenticationPrincipal CustomUser customUser) {
        questionService.deleteAnswer(customUser.getUserId());
        return ResponseEntity.noContent().build(); // 성공적으로 삭제되었으며, 본문 없음을 의미
    }
}
