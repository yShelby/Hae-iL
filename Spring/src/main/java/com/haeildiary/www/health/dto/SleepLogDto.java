<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/health/dto/SleepLogDto.java
package com.haeildiary.www.health.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.haeildiary.www.health.entity.SleepLog;
========
package com.haeildairy.www.health.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.haeildairy.www.health.entity.SleepLog;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/health/dto/SleepLogDto.java
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

public class SleepLogDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SaveRequest {
        private LocalDate sleepDate;

        @JsonFormat(pattern = "HH:mm")
        private LocalTime bedtime;

        @JsonFormat(pattern = "HH:mm")
        private LocalTime waketime;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private LocalDate sleepDate;

        @JsonFormat(pattern = "HH:mm")
        private LocalTime bedtime;

        @JsonFormat(pattern = "HH:mm")
        private LocalTime waketime;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class Response {
        private Long sleepId;
        private LocalDate sleepDate;

        @JsonFormat(pattern = "HH:mm")
        private LocalTime bedtime;

        @JsonFormat(pattern = "HH:mm")
        private LocalTime waketime;

        private Double totalHours;

        public static Response fromEntity(SleepLog entity) {
            return Response.builder()
                    .sleepId(entity.getSleepId())
                    .sleepDate(entity.getSleepDate())
                    .bedtime(entity.getBedtime())
                    .waketime(entity.getWaketime())
                    .totalHours(entity.getTotalHours())
                    .build();
        }
    }
}