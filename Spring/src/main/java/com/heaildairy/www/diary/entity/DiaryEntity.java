// 📄 파일 경로: com.heaildairy.www.diary.entity.DiaryEntity.java
// 📌 역할:
//   - 📚 JPA를 통해 diary 테이블과 매핑되는 일기 엔티티
//   - 👤 UserEntity와 다대일 관계 설정 (각 일기는 하나의 사용자에 속함)
//   - ✍️ 제목, 내용(TipTap JSON), 날씨, 작성 날짜 필드 포함
//   - ⏰ 생성일, 수정일 자동 관리

// 📊 데이터 흐름도:
// 1️⃣ 프론트엔드에서 일기 작성 데이터 요청 (POST)
// 2️⃣ 📦 DiaryEntity 객체 생성 (Builder 또는 기본 생성자)
// 3️⃣ 🧠 Spring Data JPA를 통해 DB에 저장
// 4️⃣ 🗂️ 조회/수정 시 이 엔티티를 통해 데이터 매핑됨
// 5️⃣ ✏️ 수정 시 updatedAt 자동 변경됨

package com.heaildairy.www.diary.entity;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.emotion.entity.MoodEntry;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "diary") // 🗃️ DB 내 diary 테이블과 매핑
public class DiaryEntity {

    // 🆔 일기 고유 ID (자동 증가)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_id")
    private Long diaryId;

    // 👤 사용자와의 다대일 관계 설정 (지연 로딩)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // 📝 일기 제목
    @Column(nullable = false)
    private String title;

    // 🖋️ 일기 본문 내용 (TipTap JSON 형식 문자열로 저장)
    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // 🌤️ 날씨 정보
    @Column(nullable = false)
    private String weather;

    // 📅 작성 날짜 (사용자가 선택한 날짜)
    @Column(name = "diary_date", nullable = false)
    private LocalDate diaryDate;

    // ⏱️ 일기 생성 시각 (자동 저장, 수정 시 변경되지 않음)
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 🕓 일기 수정 시각 (자동 갱신됨)
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // 📊 MoodEntry와의 1:1 관계 설정 (양방향 매핑)
    // mappedBy는 관계의 주인이 아님을 나타내며, MoodEntry 엔티티의 'diary' 필드에 의해 매핑됨
    @OneToOne(mappedBy = "diary", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private MoodEntry moodEntry;

    /**
     * 🛠️ 빌더 생성자
     * - 일기 작성 시 필수 정보만으로 객체를 쉽게 생성할 수 있게 도와줌
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
