package com.haeildiary.www.recommend.movie.movieresponse;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MovieCreditsResponse {
        private List<Cast> cast;
        private List<Crew> crew;

        @Getter @Setter
        public static class Cast {
            private String name;
        }

        @Getter @Setter
        public static class Crew {
            private String name;
            private String job;
        }
    }
