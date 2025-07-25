package com.haeildiary.www.recommend.movie.movieresponse;

import lombok.Getter;

import java.util.List;

@Getter
public class MovieTrailerResponse {
    private List<TmdbVideoResponse> results;

    @Getter
    public static class TmdbVideoResponse {
        private String id;
        private String key;
        private String name;
        private String site;
        private String type;
    }
}