package com.haeildiary.www.recommend.movie.moviedto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MovieDto {
    @JsonProperty("id")
    private Integer movieKey;
    private String title;
    private String overview;
    @JsonProperty("vote_average")
    private Double voteAverage;
    private String trailerUrl;
    @JsonProperty("poster_path")
    private String posterPath;
    private List<String> castNames;
    private String directorName;
    private boolean adult;
}