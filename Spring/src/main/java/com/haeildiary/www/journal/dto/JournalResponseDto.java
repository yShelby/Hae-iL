<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/journal/dto/JournalResponseDto.java
package com.haeildiary.www.journal.dto;

import com.haeildiary.www.journal.entity.JournalEntity;
========
package com.haeildairy.www.journal.dto;

import com.haeildairy.www.journal.entity.JournalEntity;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/journal/dto/JournalResponseDto.java
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class JournalResponseDto {
    private final Long id;
    private final String category;
    private final String title;
    private final String content;
    private final double rating;
    private final LocalDate journalDate;
    private final LocalDateTime createdAt;

    public JournalResponseDto(JournalEntity journal) {
        this.id = journal.getJournalId();
        this.category = journal.getCategory().name();
        this.title = journal.getTitle();
        this.content = journal.getContent();
        this.rating = journal.getRating();
        this.journalDate = journal.getJournalDate();
        this.createdAt = journal.getCreatedAt();
    }
}
