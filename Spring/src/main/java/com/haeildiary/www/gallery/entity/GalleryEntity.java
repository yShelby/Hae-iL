<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/gallery/entity/GalleryEntity.java
package com.haeildiary.www.gallery.entity;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.diary.entity.DiaryEntity;
========
package com.haeildairy.www.gallery.entity;

import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.diary.entity.DiaryEntity;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/gallery/entity/GalleryEntity.java
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 🖼️ GalleryEntity.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 사용자가 작성한 일기(Diary)에 첨부된 이미지 정보를 DB에 저장하는 JPA 엔티티
 * - 이미지 파일의 S3 저장소 키, 관련 일기 및 사용자 정보 관리
 *
 * 📊 데이터 흐름도
 * 1️⃣ 이미지 업로드 시 사용자 및 일기 정보를 받아 GalleryEntity 객체 생성
 * 2️⃣ 이미지 파일의 S3 저장소 key(fileKey)를 저장
 * 3️⃣ 이미지가 첨부된 일기 날짜(diaryDate) 기록
 * 4️⃣ DB에 저장되어 일기와 이미지 간 1:1 연관 관계 유지
 * 5️⃣ 조회, 수정, 삭제 시 해당 이미지 정보 참조 및 활용
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Gallery") // 🏷️ DB 테이블명 지정
public class GalleryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long imageId; // 🆔 이미지 고유 ID (PK)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user; // 👤 이미지 업로더 (UserEntity와 다대일 연관관계)

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id", nullable = false, unique = true)
    private DiaryEntity diary; // 📔 이미지가 첨부된 일기 (1:1 매핑)

    @Column(name = "file_key", nullable = false)
    private String fileKey; // 🔑 S3 저장소 내 이미지 파일 키 (URL 아님)

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt; // ⏰ 이미지 업로드 생성 시간 자동 기록

    /**
     * 📦 빌더 패턴 생성자
     * - 사용자, 일기, 파일키, 일기 날짜를 받아 객체 초기화
     */
    @Builder
    public GalleryEntity(UserEntity user, DiaryEntity diary, String fileKey) {
        this.user = user;
        this.diary = diary;
        this.fileKey = fileKey;
    }
}
