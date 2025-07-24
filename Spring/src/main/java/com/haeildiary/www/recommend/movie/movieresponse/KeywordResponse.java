package com.haeildiary.www.recommend.movie.movieresponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class KeywordResponse {
    private Integer id;

    @JsonProperty("keywords")
    private List<Keyword> keywords;

    @Getter
    @Setter
    public static class Keyword {
        private Integer id;
        private String name;
    }
}
