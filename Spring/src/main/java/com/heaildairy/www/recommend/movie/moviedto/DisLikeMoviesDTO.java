package com.heaildairy.www.recommend.movie.moviedto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DisLikeMoviesDTO {
    private Integer dislikeId;
    private String movieKey;
}
