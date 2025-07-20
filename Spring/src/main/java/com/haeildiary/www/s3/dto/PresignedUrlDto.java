package com.haeildiary.www.s3.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 🔐 PresignedUrlDto.java
 * ──────────────────────────────
 * ✅ 역할:
 * - AWS S3에 파일 업로드 시 사용할 수 있는 사전 서명된 URL과
 *   해당 파일의 키(fileKey)를 클라이언트에 전달하는 데이터 전송 객체(DTO)
 *
 * 📊 데이터 흐름도
 * 1️⃣ S3Service에서 Presigned URL과 파일 키를 생성
 * 2️⃣ 이 DTO 객체를 빌더 패턴으로 만들어서 컨트롤러에 전달
 * 3️⃣ 컨트롤러가 클라이언트에게 JSON 형태로 응답 반환
 */

@Getter
@Builder
public class PresignedUrlDto {
    private String presignedUrl; // 🔑 클라이언트가 S3에 직접 파일 업로드 시 사용할 수 있는 URL
    private String fileKey;      // 🗂️ S3 내 저장되는 파일의 고유 키 (경로)
}
