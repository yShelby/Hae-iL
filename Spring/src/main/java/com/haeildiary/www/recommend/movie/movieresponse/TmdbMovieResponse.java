package com.haeildiary.www.recommend.movie.movieresponse;

import com.haeildiary.www.recommend.movie.moviedto.MovieDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TmdbMovieResponse {
    private List<MovieDto> results;
}
