package com.haeildiary.www.recommend.movie.movieentity;

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
    @Column(name = "mood_type")
    private String moodType;

    @Id
    @Column(name = "genre_code")
    private  Integer genreCode;

    @Column(name = "genre_name")
    private String genreName;

    @Column(name = "genre_weight")
    private Double genreWeight;
}
