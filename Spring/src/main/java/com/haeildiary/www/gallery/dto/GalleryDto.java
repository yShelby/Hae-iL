<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/gallery/dto/GalleryDto.java
package com.haeildiary.www.gallery.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.haeildiary.www.gallery.entity.GalleryEntity;
========
package com.haeildairy.www.gallery.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.haeildairy.www.gallery.entity.GalleryEntity;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/gallery/dto/GalleryDto.java
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

/**
 * 🎨 GalleryDto.java
 * ──────────────────────────────
 * ✅ 역할:
 * - GalleryEntity 엔티티 데이터를 API 응답에 맞게 변환해 전달하는 DTO (Data Transfer Object)
 * - 클라이언트에게 갤러리 이미지 관련 주요 정보만 노출
 *
 * 📊 데이터 흐름도
 * 1️⃣ DB에서 GalleryEntity 조회
 * 2️⃣ fromEntity() 메서드로 GalleryDto 객체 생성
 * 3️⃣ API 응답으로 GalleryDto 리스트 반환
 */

@Getter
@Builder
public class GalleryDto {
        private Long fileId;        // 🆔 이미지 파일 고유 ID
        private Long diaryId;       // 📔 이미지가 속한 일기 ID
        private String fileKey;     // 🔑 S3에 저장된 파일 키 (URL 일부)

        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate diaryDate; // 📅 이미지가 속한 일기의 날짜

        /**
         * 🛠️ Entity → DTO 변환 메서드
         * - GalleryEntity에서 필요한 필드만 추출해 DTO로 만듦
         */
        public static GalleryDto fromEntity(GalleryEntity image) {
                return GalleryDto.builder()
                        .fileId(image.getImageId())                     // 이미지 고유 ID 세팅
                        .diaryId(image.getDiary().getDiaryId())         // 연결된 일기 ID 세팅
                        .fileKey(image.getFileKey())                     // S3 저장 키 세팅
                        .diaryDate(image.getDiary().getDiaryDate())                 // 일기 작성 날짜 세팅
                        .build();
        }
}
