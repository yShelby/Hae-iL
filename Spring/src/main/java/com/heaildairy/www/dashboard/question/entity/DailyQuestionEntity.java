package com.heaildairy.www.dashboard.question.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Entity
@Table(name = "daily_question")
public class DailyQuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer questionId;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "date", nullable = false, unique = true)
    private LocalDate date;

    public DailyQuestionEntity(String questionText, LocalDate date) {
        this.questionText = questionText;
        this.date = date;
    }
}
