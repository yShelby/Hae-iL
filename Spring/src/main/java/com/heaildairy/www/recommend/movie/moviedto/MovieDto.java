package com.heaildairy.www.recommend.movie.moviedto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieDto {
    private Integer id;
    private String title;
    private String overview;
    private Double vote_average;
    private String trailerUrl;
    private String poster_path;
}