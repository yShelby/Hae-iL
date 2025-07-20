<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/entity/MoodDetail.java
package com.haeildiary.www.emotion.entity;

import com.haeildiary.www.diary.entity.DiaryEntity;
========
package com.haeildairy.www.emotion.entity;

import com.haeildairy.www.diary.entity.DiaryEntity;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/entity/MoodDetail.java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

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

    @Column(name = "confidence_score", precision = 3, scale = 2)
    private BigDecimal confidenceScore;

}
