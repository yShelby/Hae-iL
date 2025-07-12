package com.heaildairy.www.dashboard.question.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuestionAnswerDto {
    private String questionText;
    private String answerText; // 답변이 없으면 null
}
