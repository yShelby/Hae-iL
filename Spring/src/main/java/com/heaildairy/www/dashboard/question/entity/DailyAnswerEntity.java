package com.heaildairy.www.dashboard.question.entity;

import com.heaildairy.www.auth.entity.UserEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "daily_answer")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyAnswerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Integer answerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // 어떤 질문에 대한 답변인지 참조합니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private DailyQuestionEntity question;

    @Column(name = "answer_text", nullable = false, columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "answer_date", nullable = false)
    private LocalDate answerDate;

    @Builder
    public DailyAnswerEntity(UserEntity user, DailyQuestionEntity question, String answerText, LocalDate answerDate) {
        this.user = user;
        this.question = question;
        this.answerText = answerText;
        this.answerDate = answerDate;
    }

    // 답변 내용을 수정하는 편의 메서드
    public void updateAnswer(String answerText) {
        this.answerText = answerText;
    }
}

