package com.heaildairy.www.health.dto;

import com.heaildairy.www.health.entity.ExerciseLog;
import lombok.*;

import java.time.LocalDate;

public class ExerciseLogDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaveRequest {
        private LocalDate exerciseDate;
        private String exerciseType;
        private Integer duration; // 분 단위
        private String intensity; // 낮음/보통/높음
    }

    @Getter @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private LocalDate exerciseDate;
        private String exerciseType;
        private Integer duration;
        private String intensity;
    }

    @Getter @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long exerciseId;
        private LocalDate exerciseDate;
        private String exerciseType;
        private Integer duration;
        private String intensity;

        public static Response fromEntity(ExerciseLog entity) {
            return Response.builder()
                    .exerciseId(Long.valueOf(entity.getExerciseId()))
                    .exerciseDate(entity.getExerciseDate())
                    .exerciseType(entity.getExerciseType())
                    .duration(entity.getDuration())
                    .intensity(entity.getIntensity())
                    .build();
        }
    }
}
