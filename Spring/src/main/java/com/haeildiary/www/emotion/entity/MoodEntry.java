<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/entity/MoodEntry.java
package com.haeildiary.www.emotion.entity;

import com.haeildiary.www.diary.entity.DiaryEntity;
========
package com.haeildairy.www.emotion.entity;

import com.haeildairy.www.diary.entity.DiaryEntity;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/entity/MoodEntry.java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "MoodEntry")
public class MoodEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mood_entry_id")
    private Long moodEntryId;

    @OneToOne
    @JoinColumn(name = "diary_id", nullable = false, unique = true,
    foreignKey = @ForeignKey(name = "fk_diary_id"))
    private DiaryEntity diary;

    @Column(name = "mood_score", nullable = false)
    private Integer moodScore;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
