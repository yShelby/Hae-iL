package com.haeildiary.www.recommend.movie.movieentity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmotionGenreMapId implements Serializable {
    private String emotionType;
    private Integer genreCode;
}