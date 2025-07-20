package com.haeildiary.www.dashboard.fortune.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class FortuneDto {

    /**
     * 오늘의 포춘쿠키 상태를 클라이언트에게 응답하기 위한 Dto
     * - GET /api/dashboard/fortune
     */
    @Getter
    @Builder
    public static class StatusResponse{

        /** 오늘 쿠키를 열 수 있는지 여부 (true: 열 수 있음, false: 이미 열었음) */
        private boolean canOpen;

        /**
         * 이미 쿠키를 열었을 경우, 이전에 확인했던 메시지
         * (추후 기능 확장 시, 이전에 뽑은 운세를 DB에 기록하고 불러와서 채워줄 수 있습니다.)
         */
        private String message;
    }

    /**
     * 포춘쿠키를 성공적으로 열었을 때의 결과를 응답하기 위한 Dto
     * - POST /api/dashboard/fortune
     */
    @Getter
    @AllArgsConstructor // 모든 필드를 받는 생성자를 자동으로 만듭니다.
    public static class OpenResponse {
        /** 새로 뽑은 운세 메시지 */
        private String message;
    }
}
