package com.haeildiary.www.dashboard.wordcloud.emotion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "test_mood_detail")
@Getter
@Setter
@NoArgsConstructor
public class TestMoodDetailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    // 참고: 실제 Diary 엔티티와의 관계 설정이 필요
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "diary_id")
    // private Diary diary;

    @Column(name = "keyword", nullable = false)
    private String keyword;

    @Column(name = "word_value", nullable = false)
    private Integer value;

    @Column(name = "sentiment", nullable = false)
    private String sentiment;

    public TestMoodDetailEntity(String keyword, Integer value, String sentiment) {
        this.keyword = keyword;
        this.value = value;
        this.sentiment = sentiment;
    }
}
