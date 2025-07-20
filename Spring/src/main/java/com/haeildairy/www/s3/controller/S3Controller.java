package com.haeildairy.www.s3.controller;

import com.haeildairy.www.s3.dto.PresignedUrlDto;
import com.haeildairy.www.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * ☁️ S3Controller.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 클라이언트로부터 파일명 요청을 받아 AWS S3에 업로드할 수 있는
 *   사전 서명된 URL(Presigned URL)을 생성해 반환하는 REST 컨트롤러
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트가 업로드할 파일 이름을 쿼리 파라미터로 GET 요청
 * 2️⃣ S3Service가 해당 파일명에 대해 Presigned URL 생성
 * 3️⃣ 생성된 URL을 PresignedUrlDto 객체로 감싸 응답
 * 4️⃣ 클라이언트는 받은 URL로 S3에 직접 파일 업로드 수행 가능
 */

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service; // Presigned URL 생성 서비스

    /**
     * 📥 파일명으로 Presigned URL 요청 처리 메서드
     *
     * @param filename 업로드할 파일 이름
     * @return 사전 서명된 URL을 담은 DTO와 함께 HTTP 200 응답 반환
     */
    @GetMapping("/presigned-url")
    public ResponseEntity<PresignedUrlDto> getPresignedUrl(@RequestParam String filename) {
        // 2️⃣ S3Service에서 Presigned URL 생성 후 반환
        return ResponseEntity.ok(s3Service.getPresignedUrl(filename));
    }

    // 프로필 이미지 업로드 - Presigned URL 요청 처리 메서드
    @GetMapping("/profile-presigned-url")
    public ResponseEntity<String> getProfilePresignedUrl(
            @RequestParam String identifier, // 파라미터 타입 변경
            @RequestParam String filename,
            @RequestParam String contentType) {

        String presignedUrl = s3Service.generateProfilePresignedPutUrl(identifier, filename, contentType, 10); // identifier 사용
        return ResponseEntity.ok(presignedUrl);
    }
}
