package com.heaildairy.www.dashboard.question.service;

import com.heaildairy.www.dashboard.question.dto.QuestionDto;
import com.heaildairy.www.dashboard.question.entity.DailyQuestionEntity;
import com.heaildairy.www.dashboard.question.repository.DailyQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DailyQuestionService {

    private final DailyQuestionRepository dailyQuestionRepository;

    /**
     * 랜덤으로 오늘의 질문 하나를 조회
     * @return 랜덤 질문 텍스트가 담긴 QuestionDto
     */
    public QuestionDto getRandomQuestion() {
        DailyQuestionEntity randomQuestion = dailyQuestionRepository.findRandomQuestion()
                .orElseThrow(() -> new IllegalStateException("DB에 질문 데이터가 없습니다."));
        return new QuestionDto(randomQuestion.getQuestionText());
    }
}
