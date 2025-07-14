package com.heaildairy.www.recommend.movie.movieresponse;

import lombok.Getter;

import java.util.List;

@Getter
public class MovieTrailerResponse {
    private List<TmdbVideoResponse> results;
}