package com.heaildairy.www.health.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.heaildairy.www.health.entity.SleepLog;
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
                    .sleepId(Long.valueOf(entity.getSleepId()))
                    .sleepDate(entity.getSleepDate())
                    .bedtime(entity.getBedtime())
                    .waketime(entity.getWaketime())
                    .totalHours(entity.getTotalHours())
                    .build();
        }
    }
}