package com.heaildairy.www.recommend.movie.moviedto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DisLikeMoviesDto {
    private Integer dislikeId;
    private String movieKey;
}
