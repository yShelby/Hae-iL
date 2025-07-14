package com.heaildairy.www.dashboard.question.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "daily_question")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyQuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer questionId;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    // CSV 데이터 주입을 위한 생성자
    public DailyQuestionEntity(String questionText) {
        this.questionText = questionText;
    }
}
