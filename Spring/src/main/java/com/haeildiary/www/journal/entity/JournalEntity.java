<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/journal/entity/JournalEntity.java
package com.haeildiary.www.journal.entity;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.journal.dto.JournalRequestDto;
========
package com.haeildairy.www.journal.entity;

import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.journal.dto.JournalRequestDto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/journal/entity/JournalEntity.java
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "Journal")
public class JournalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "journal_id")
    private Long journalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private Double rating;

    @Column(name = "journal_date")
    private LocalDate journalDate;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public JournalEntity(UserEntity user, JournalRequestDto dto) {
        this.user = user;
        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.category = dto.getCategory();
        this.rating = dto.getRating();
        this.journalDate = dto.getJournalDate();
    }

    public void update(JournalRequestDto requestDto) {
        this.title = requestDto.getTitle();
        this.content = requestDto.getContent();
        this.category = requestDto.getCategory();
        this.rating = requestDto.getRating();
        this.journalDate = requestDto.getJournalDate();
    }
}
