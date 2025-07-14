package com.heaildairy.www.recommend.movie.movieentity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "emotion_genre_map")
@AllArgsConstructor
@NoArgsConstructor
@IdClass(EmotionGenreMapId.class)
public class EmotionGenreMapEntity {

    @Id
    @Column(name = "emotion_type")
    private String emotionType;

    @Id
    @Column(name = "genre_code")
    private  Integer genreCode;

    @Column(name = "genre_name")
    private String genreName;

    @Column(name = "genre_weight")
    private Integer genreWeight;
}
