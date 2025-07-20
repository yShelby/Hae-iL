<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/health/dto/ExerciseLogDto.java
package com.haeildiary.www.health.dto;

import com.haeildiary.www.health.entity.ExerciseLog;
========
package com.haeildairy.www.health.dto;

import com.haeildairy.www.health.entity.ExerciseLog;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/health/dto/ExerciseLogDto.java
import lombok.*;

import java.time.LocalDate;

import static java.lang.Long.valueOf;

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
                    .exerciseId(entity.getExerciseId())
                    .exerciseDate(entity.getExerciseDate())
                    .exerciseType(entity.getExerciseType())
                    .duration(entity.getDuration())
                    .intensity(entity.getIntensity())
                    .build();
        }
    }
}
