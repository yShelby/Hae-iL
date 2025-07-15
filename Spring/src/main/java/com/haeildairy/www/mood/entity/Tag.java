package com.haeildairy.www.mood.entity;

import com.haeildairy.www.diary.entity.DiaryEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "Tag")
@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Long tagId;

    @Column(name = "tag_name", length = 50, nullable = false)
    private String tagName;

    @ManyToOne
    @JoinColumn(name = "diary_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_tag_diary_id"))
    private DiaryEntity diary;
}
