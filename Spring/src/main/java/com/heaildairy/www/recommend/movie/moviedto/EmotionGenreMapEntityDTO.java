package com.heaildairy.www.recommend.movie.moviedto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmotionGenreMapEntityDTO {
    private String emotionType;
    private Integer genreCode;
    private String genreName;
    private Double genreWeight;
}