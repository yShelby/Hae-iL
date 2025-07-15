package com.heaildairy.www.s3.service;

import com.heaildairy.www.s3.dto.PresignedUrlDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

/**
 * ☁️ S3Service.java
 * ──────────────────────────────
 * ✅ 역할:
 * - AWS S3와 연동하여 파일 업로드를 위한 사전 서명된 URL 생성
 * - S3에 저장된 파일 삭제 기능 제공
 *
 * 📊 데이터 흐름도:
 * 1️⃣ 클라이언트가 업로드할 파일 이름을 전달받음
 * 2️⃣ UUID를 활용해 고유한 파일키 생성 (images/ 폴더 내)
 * 3️⃣ PutObjectRequest와 PutObjectPresignRequest를 생성해 10분짜리 사전 서명 URL 발급
 * 4️⃣ PresignedUrlDto에 URL과 파일키를 담아 반환 → 클라이언트에게 전달
 * 5️⃣ 삭제 요청 시, S3Client를 통해 해당 파일키로 S3에서 객체 삭제 실행
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    @Value("${cloud.aws.s3.bucket-name}")
    private String bucketName; // 🏷️ S3 버킷 이름 (application.yml 또는 properties에서 주입)

    private final S3Presigner s3Presigner; // 🔐 사전 서명 URL 생성기
    private final S3Client s3Client;       // 🗑️ S3 파일 삭제용 클라이언트

    /**
     * 📦 클라이언트가 파일을 업로드할 때 사용할 사전 서명 URL을 생성
     * @param filename 클라이언트가 업로드하려는 파일 이름
     * @return PresignedUrlDto: 사전 서명 URL과 S3 내 저장될 파일 키 반환
     */
    public PresignedUrlDto getPresignedUrl(String filename) {
        // 1️⃣ 고유 파일키 생성 (images/폴더 + UUID + 원본 파일명)
        String fileKey = "images/" + UUID.randomUUID().toString() + "-" + filename;

        // 2️⃣ 파일 업로드 요청 생성
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();

        // 3️⃣ 10분 유효한 사전 서명 요청 생성
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectRequest)
                .build();

        // 4️⃣ 사전 서명 URL 생성
        String presignedUrl = s3Presigner.presignPutObject(presignRequest).url().toString();

        // 5️⃣ URL과 키를 DTO에 담아 반환
        return PresignedUrlDto.builder()
                .presignedUrl(presignedUrl)
                .fileKey(fileKey)
                .build();
    }

    /**
     * 📦 프로필 이미지 업로드 - Presigned URL을 생성
     * 'profile_images/{userId}/profile.jpg'와 같은 고정된 경로를 사용
     *
     * @param identifier 사용자 임시 ID (프로필 이미지 경로에 사용)
     * @param filename 원본 파일 이름 (확장자 추출용)
     * @param contentType 파일의 MIME 타입 (예: "image/jpeg", "image/png")
     * @param expirationMinutes Presigned URL의 유효 시간 (분 단위)
     * @return 생성된 Presigned URL 문자열
     */
    public String generateProfilePresignedPutUrl(String identifier, String filename, String contentType, int expirationMinutes) {

        // 1. 프로필 이미지의 고정된 S3 객체 키 생성
        String fileExtension = "";

        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            fileExtension = filename.substring(dotIndex); // 확장자 추출
        }

        String objectKey = "profile_images/" + identifier + "/profile" + fileExtension;

        // 2. 파일 업로드 요청 생성
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(contentType)
                .build();

        // 3. Presigned URL 요청 생성 (유효 시간 설정)
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectRequest)
                .build();

        // 4. 사전 서명 URL 생성
        String presignedUrl = s3Presigner.presignPutObject(presignRequest).url().toString();

        log.info("Generated Profile Presigned URL for userId: {}, objectKey: {}", identifier, objectKey);
        return presignedUrl;
    }

    /**
     * S3 객체를 한 경로에서 다른 경로로 이동 - 복사 후 원본 삭제
     *
     * @param sourceKey 원본 객체 키
     * @param destinationKey 대상 객체 키
     * @return 이동 성공 여부
     */
    public boolean moveS3Object(String sourceKey, String destinationKey) {
        try {
            // 1. 객체 복사
            CopyObjectRequest copyObjectRequest = CopyObjectRequest.builder()
                    .sourceBucket(bucketName)
                    .sourceKey(sourceKey)
                    .destinationBucket(bucketName)
                    .destinationKey(destinationKey)
                    .build();
            s3Client.copyObject(copyObjectRequest);
            log.info("Successfully copied object from {} to {}", sourceKey, destinationKey);

            // 2. 원본 객체 삭제
            deleteFile(sourceKey); // 기존 deleteFile 메소드 재사용
            return true;
        } catch (Exception e) {
            log.error("Failed to move S3 object from {} to {}: {}", sourceKey, destinationKey, e.getMessage(), e);
            return false;
        }
    }


    /**
     * 🗑️ S3 버킷에서 파일 삭제
     * @param fileKey 삭제할 파일의 S3 키
     */
    public void deleteFile(String fileKey) {
        // 1️⃣ 유효하지 않은 키 검사
        if (fileKey == null || fileKey.isBlank()) {
            log.warn("File key is null or empty, skipping deletion.");
            return;
        }
        try {
            // 2️⃣ 삭제 요청 생성
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            // 3️⃣ S3에 파일 삭제 실행
            s3Client.deleteObject(deleteObjectRequest);
            log.info("Successfully deleted file from S3: {}", fileKey);
        } catch (Exception e) {
            // 4️⃣ 삭제 실패 시 로깅 및 필요 시 예외 처리 가능
            log.error("Failed to delete file from S3. File key: {}", fileKey, e);
        }
    }

}
