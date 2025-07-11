package com.heaildairy.www.emotion.entity;

import com.heaildairy.www.diary.entity.DiaryEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "MoodEntries")
public class MoodEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mood_entry_id")
    private Long moodEntryId;

    @OneToOne
    @JoinColumn(name = "diary_id", nullable = false, unique = true,
    foreignKey = @ForeignKey(name = "fk_diary_id"))
    private DiaryEntity diary;
//    @Column(name = "diary_id", nullable = false, unique = true)
//    private Integer diaryId;

    @Column(name = "mood_score", nullable = false)
    private Integer moodScore;

//    @Column(name = "sentiment_type", nullable = false)
//    private String sentimentType;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
