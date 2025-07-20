package com.haeildiary.www.mood.entity;

import com.haeildiary.www.diary.entity.DiaryEntity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "MoodDetail")
@Entity
public class MoodDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id", nullable = false,
    foreignKey = @ForeignKey(name = "diary_id"))
    private DiaryEntity diary;

    @Column(name = "percentage", nullable = false)
    private Integer percentage;

    @Column(name = "emotion_type",length = 50)
    private String emotionType;

}
