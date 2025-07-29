package com.haeildiary.www.selfdiagnosis.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public class SelfDiagnosisDto {

    // POST REQUEST DTO
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubmitRequest {
        @NotNull(message = "총점을 입력해주세요")
        @Min(value = 0, message = "점수는 0점 이상이어야 합니다")
        private Integer totalScore;
    }

    //========================================

    // POST RESPONSE ALLStatus DTO (3개 전부)

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AllStatusResponse {
        private StatusResponse anxiety;
        private StatusResponse depression;
        private StatusResponse stress;
    }

    //========================================

    // POST RESPONSE DTO (단일)
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL) // null인 필드는 JSON에서 제외
    public static class StatusResponse { // 기본 형태
        private boolean available; // 항상 포함 (true/false)

        // available = false일 때만 포함
        private Integer percentage;
        private String result;
        private LocalDate nextAvailableDate;

        // 과거에 검사하지 않았을 때 보내는 message
        private String message;

    }

}
