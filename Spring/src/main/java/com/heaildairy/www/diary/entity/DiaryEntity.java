package com.heaildairy.www.diary.entity;

import com.heaildairy.www.auth.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 📔 DiaryEntity.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 일기(Diary) 데이터베이스 테이블과 매핑되는 JPA 엔티티 클래스
 * - 사용자, 제목, 내용, 날씨, 작성 날짜 등 일기의 주요 정보를 저장
 * - TipTap 에디터 JSON 콘텐츠를 대용량 텍스트로 저장
 * - 생성 시간 자동 기록
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트에서 일기 작성 요청 시 데이터 수신
 * 2️⃣ DiaryEntity 객체 생성 (빌더 또는 기본 생성자)
 * 3️⃣ DB에 저장 (JPA 영속성 컨텍스트 관리)
 * 4️⃣ 필요한 경우 조회 및 업데이트
 */

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "diaries")  // 🗃️ DB 테이블명 명시
public class DiaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")  // 🆔 기본키, 자동증가
    private Long diaryId;

    @ManyToOne(fetch = FetchType.LAZY)  // 👥 사용자와 다대일 관계 (Lazy 로딩)
    @JoinColumn(name = "user_id", nullable = false)  // 🗝️ 외래키(user_id)
    private UserEntity user;

    @Column(nullable = false)
    private String title;   // 📝 일기 제목

    @Lob  // 📚 대용량 텍스트 저장 (TipTap 에디터의 JSON)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // 🖋️ 일기 내용 (JSON String)

    @Column(nullable = false)
    private String weather; // ☀️ 날씨 정보

    @Column(name = "diary_date", nullable = false)
    private LocalDate diaryDate; // 📅 일기 작성 날짜

    @CreationTimestamp  // ⏰ 생성 시각 자동 기록 (수정 시 미변경)
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * 🛠️ 빌더 생성자
     * - 새로운 DiaryEntity 객체 생성 시 필수 필드 초기화에 사용
     */
    @Builder
    public DiaryEntity(UserEntity user, String title, String content, String weather, LocalDate diaryDate) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.weather = weather;
        this.diaryDate = diaryDate;
    }
}
