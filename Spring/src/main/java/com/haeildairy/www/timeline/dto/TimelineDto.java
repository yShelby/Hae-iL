package com.haeildairy.www.timeline.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.haeildairy.www.diary.entity.DiaryEntity;
import com.haeildairy.www.health.entity.ExerciseLog;
import com.haeildairy.www.health.entity.MealLog;
import com.haeildairy.www.health.entity.SleepLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
@AllArgsConstructor
public class TimelineDto {

    private String type; // "sleep", "exercise", "meal"
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    // Sleep 전용 필드
    private LocalTime bedtime;
    private LocalTime waketime;
    private Double totalSleepHours;

    // Exercise 전용 필드
    private String exerciseType;
    private Integer duration;
    private String intensity;

    // Meal 전용 필드
    private String breakfast;
    private String lunch;
    private String dinner;
    private String snack;

    // createdAt 공통 사용 가능
    private String createdAt;

    public static TimelineDto fromDiary(DiaryEntity diary) {
        return TimelineDto.builder()
                .type("diary")
                .date(diary.getDiaryDate())
                .createdAt(diary.getCreatedAt().toString())
                .build();
    }
    public static TimelineDto fromSleepLog(SleepLog sleepLog) {
        return TimelineDto.builder()
                .type("sleep")
                .date(sleepLog.getSleepDate())
                .bedtime(sleepLog.getBedtime())
                .waketime(sleepLog.getWaketime())
                .totalSleepHours(sleepLog.getTotalHours())
                .createdAt(sleepLog.getCreatedAt().toString())
                .build();
    }

    public static TimelineDto fromExerciseLog(ExerciseLog log) {
        return TimelineDto.builder()
                .type("exercise")
                .date(log.getExerciseDate())
                .exerciseType(log.getExerciseType())
                .duration(log.getDuration())
                .intensity(log.getIntensity())
                .createdAt(log.getCreatedAt().toString())
                .build();
    }

    public static TimelineDto fromMealLog(MealLog log) {
        return TimelineDto.builder()
                .type("meal")
                .date(log.getMealDate())
                .breakfast(log.getBreakfast())
                .lunch(log.getLunch())
                .dinner(log.getDinner())
                .snack(log.getSnack())
                .createdAt(log.getCreatedAt().toString())
                .build();
    }
}

