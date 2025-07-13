package com.heaildairy.www.dashboard.question.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.dashboard.question.dto.QuestionAnswerDto;
import com.heaildairy.www.dashboard.question.entity.DailyAnswerEntity;
import com.heaildairy.www.dashboard.question.entity.DailyQuestionEntity;
import com.heaildairy.www.dashboard.question.repository.DailyAnswerRepository;
import com.heaildairy.www.dashboard.question.repository.DailyQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DailyQuestionService {

    private final DailyAnswerRepository dailyAnswerRepository;
    private final DailyQuestionRepository dailyQuestionRepository;
    private final UserRepository userRepository;

    /**
     * 오늘의 질문과, 사용자가 이전에 작성한 답변이 있다면 함께 조회
     */
    public QuestionAnswerDto getTodayQuestionAndAnswer(Integer userId) {
        LocalDate today = LocalDate.now();
        DailyQuestionEntity todayQuestion = getTodayQuestion();

        // 오늘 날짜로 저장된 답변이 있는지 조회
        String answerText = dailyAnswerRepository.findByUser_UserIdAndAnswerDate(userId, today)
                .map(DailyAnswerEntity::getAnswerText) // 답변이 있으면 텍스트를 가져오고
                .orElse(null); // 없으면 null

        return new QuestionAnswerDto(todayQuestion.getQuestionText(), answerText);
    }

    /**
     * 오늘의 질문에 대한 답변을 저장하거나 업데이트
     */
    @Transactional
    public void saveOrUpdateAnswer(Integer userId, String answerText) {
        LocalDate today = LocalDate.now();
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        DailyQuestionEntity todayQuestion = getTodayQuestion();

        Optional<DailyAnswerEntity> existingAnswer = dailyAnswerRepository.findByUser_UserIdAndAnswerDate(userId, today);

        if (existingAnswer.isPresent()) {
            // 이미 답변이 있으면 내용만 업데이트
            DailyAnswerEntity answer = existingAnswer.get();
            answer.updateAnswer(answerText);
        } else {
            // 답변이 없으면 새로 생성
            DailyAnswerEntity newAnswer = DailyAnswerEntity.builder()
                    .user(user)
                    .question(todayQuestion)
                    .answerText(answerText)
                    .answerDate(today)
                    .build();
            dailyAnswerRepository.save(newAnswer);
        }
    }

    /**
     * 오늘의 질문에 대한 답변을 삭제하는 메서드
     * @param userId 현재 로그인한 사용자의 ID
     */
    @Transactional
    public void deleteAnswer(Integer userId) {
        LocalDate today = LocalDate.now();

        // 오늘 날짜에 해당하는 사용자의 답변을 찾아서 삭제
        // 답변이 없는 경우, NoSuchElementException 예외를 발생시켜 클라이언트가 알 수 있도록 한다.
        DailyAnswerEntity answer = dailyAnswerRepository.findByUser_UserIdAndAnswerDate(userId, today)
                .orElseThrow(() -> new NoSuchElementException("삭제할 답변을 찾을 수 없습니다."));

        dailyAnswerRepository.delete(answer);
    }

    /**
     * 오늘의 질문을 결정하는 로직
     * (오늘 날짜의 연중 일수) % (전체 질문 개수) 와 같은 간단한 공식을 사용
     */
    private DailyQuestionEntity getTodayQuestion() {
        long totalQuestions = dailyQuestionRepository.count();
        if (totalQuestions == 0) {
            // 실제 운영 환경에서는 기본 질문을 반환하는 것이 더 안정적일 수 있습니다.
            throw new IllegalStateException("DB에 질문 데이터가 없습니다.");
        }
        long dayOfYear = LocalDate.now().getDayOfYear();
        long offset = (dayOfYear - 1) % totalQuestions; // 0부터 시작하도록 조정

        return dailyQuestionRepository.findOneByOffset(offset);
    }
}
