<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/health/dto/MealLogDto.java
package com.haeildiary.www.health.dto;

import com.haeildiary.www.health.entity.MealLog;
========
package com.haeildairy.www.health.dto;

import com.haeildairy.www.health.entity.MealLog;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/health/dto/MealLogDto.java
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

public class MealLogDto {
    /**
     * ✅ SaveRequest (식사 저장용 DTO)
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaveRequest {
        @NotNull
        private LocalDate mealDate;

        private String breakfast;
        private String lunch;
        private String dinner;
        private String snack;
    }

    /**
     * ✅ UpdateRequest (식사 수정용 DTO)
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotNull
        private LocalDate mealDate;

        private String breakfast;
        private String lunch;
        private String dinner;
        private String snack;
    }

    /**
     * ✅ Response (식사 조회 응답 DTO)
     */
    @Getter
    @Builder
    public static class Response {
        private Long mealId;
        private LocalDate mealDate;

        private String breakfast;
        private String lunch;
        private String dinner;
        private String snack;

        public static Response fromEntity(MealLog entity) {
            return Response.builder()
                    .mealId(entity.getMealId())
                    .mealDate(entity.getMealDate())
                    .breakfast(entity.getBreakfast())
                    .lunch(entity.getLunch())
                    .dinner(entity.getDinner())
                    .snack(entity.getSnack())
                    .build();
        }
    }

}
