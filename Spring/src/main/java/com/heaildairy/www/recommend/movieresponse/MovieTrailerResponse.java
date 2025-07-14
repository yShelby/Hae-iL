package com.heaildairy.www.recommend.movieresponse;

import lombok.Getter;

import java.util.List;

@Getter
public class MovieTrailerResponse {
    private List<TmdbVideoResponse> results;
}