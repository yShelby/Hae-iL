package com.haeildairy.www.diary.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.haeildairy.www.diary.entity.DiaryEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * 📦 DiaryDto.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 클라이언트와 서버 간의 데이터 교환을 위한 DTO(데이터 전송 객체) 정의
 * - 요청(Request)과 응답(Response) 데이터 구조를 명확히 구분
 * - 유효성 검사 어노테이션을 통해 입력 데이터 검증 지원
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트 -> SaveRequest 또는 UpdateRequest DTO 전달 (일기 생성/수정 요청)
 * 2️⃣ 서버에서 DTO 유효성 검사 및 필드 값 바인딩
 * 3️⃣ 서비스/엔티티 변환 시 Response DTO로 변환하여 클라이언트에 응답 반환
 */

public class DiaryDto {

        /**
         * ➕ SaveRequest
         * - 일기 생성 시 클라이언트가 전송하는 요청 데이터 모델
         * - 필드에 @NotBlank, @NotNull 적용으로 필수 값 검증 수행
         * - diaryDate는 "yyyy-MM-dd" 포맷으로 JSON 직렬화/역직렬화
         */
        @Getter
        @Setter
        @NoArgsConstructor
        public static class SaveRequest {
                @NotBlank private String title;       // 제목 (빈 문자열 불가)
                @NotBlank private String content;     // 내용(JSON String 형태), 빈 문자열 불가
                @NotBlank private String weather;     // 날씨 정보, 빈 문자열 불가
                @NotNull
                @JsonFormat(pattern = "yyyy-MM-dd")
                private LocalDate diaryDate;           // 작성 날짜, null 불가
        }

        /**
         * ✏️ UpdateRequest
         * - 일기 수정 시 클라이언트가 전송하는 요청 데이터 모델
         * - 필수 필드에 @NotBlank 적용하여 비어있으면 안 됨
         */
        @Getter
        @Setter
        @NoArgsConstructor
        public static class UpdateRequest {
                @NotBlank private String title;       // 수정할 제목
                @NotBlank private String content;     // 수정할 내용(JSON String 형태)
                @NotBlank private String weather;     // 수정할 날씨 정보
        }

        /**
         * 🔄 Response
         * - 서버가 클라이언트에 반환하는 일기 데이터 응답 모델
         * - 엔티티 DiaryEntity를 DTO로 변환하는 정적 팩토리 메서드 포함
         * - diaryDate는 "yyyy-MM-dd" 포맷으로 JSON 직렬화
         */
        @Getter
        @Builder
        public static class Response {
                private Long diaryId;          // 일기 고유 ID
                private Integer userId;        // 작성자 사용자 ID
                private String title;          // 제목
                private String content;        // 내용(JSON String)
                private String weather;        // 날씨 정보

                @JsonFormat(pattern = "yyyy-MM-dd")
                private LocalDate diaryDate;  // 작성 날짜

                /**
                 * 📦 fromEntity()
                 * - DiaryEntity 객체를 Response DTO로 변환
                 * - 서비스/컨트롤러에서 엔티티를 바로 반환하지 않고 DTO 변환 시 사용
                 */
                public static Response fromEntity(DiaryEntity diary) {
                        return Response.builder()
                                .diaryId(diary.getDiaryId())
                                .userId(diary.getUser().getUserId())
                                .title(diary.getTitle())
                                .content(diary.getContent())
                                .weather(diary.getWeather())
                                .diaryDate(diary.getDiaryDate())
                                .build();
                }
        }
}
