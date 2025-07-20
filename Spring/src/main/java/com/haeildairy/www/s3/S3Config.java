package com.haeildairy.www.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

/**
 * ☁️ S3Config.java
 * ──────────────────────────────
 * ✅ 역할:
 * - AWS S3 SDK 관련 핵심 컴포넌트 Bean 생성 및 설정 담당
 * - S3Client: S3 버킷 내 객체의 조회, 삭제 등 일반 작업에 사용
 * - S3Presigner: 사전 서명된 URL 생성에 특화된 컴포넌트
 *
 * ⚙️ 데이터 흐름도:
 * 1️⃣ application.yml 혹은 properties 에서 AWS 접근 키, 비밀 키, 리전을 주입받음
 * 2️⃣ S3Client Bean 생성 시, Region 및 Credentials 세팅 후 빈으로 등록
 * 3️⃣ S3Presigner Bean 생성 시, 동일한 정보로 빈 등록 (사전 서명 URL 생성용)
 *
 * 📝 참고:
 * 현재 프로젝트에서 주로 파일 업로드, 삭제 등에 사용되며
 * 향후 프로필 사진 연동 기능 구현 시에도 이 컴포넌트들이 활용될 예정임!
 */

@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;  // 🔑 AWS 액세스 키

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;  // 🔐 AWS 비밀 키

    @Value("${cloud.aws.region.static}")
    private String region;     // 🌍 AWS 리전 정보

    /**
     * 🛠 S3 버킷 내 객체 조회, 삭제 등 일반 작업에 사용하는 클라이언트 Bean 생성
     * @return S3Client 빈
     */
    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(region)) // 🌍 리전 설정
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey))) // 🔑 인증 정보 설정
                .build();
    }

    /**
     * 🔐 사전 서명된 URL(Presigned URL) 생성을 위한 Presigner Bean 생성
     * @return S3Presigner 빈
     */
    @Bean
    public S3Presigner s3Presigner() {
        return S3Presigner.builder()
                .region(Region.of(region)) // 🌍 리전 설정
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey))) // 🔑 인증 정보 설정
                .build();
    }
}
