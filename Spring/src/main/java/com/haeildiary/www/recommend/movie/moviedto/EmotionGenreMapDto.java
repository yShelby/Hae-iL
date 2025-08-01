package com.haeildiary.www.recommend.movie.moviedto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmotionGenreMapDto {
    private String moodType;
    private Integer genreCode;
    private String genreName;
    private Double genreWeight;
}