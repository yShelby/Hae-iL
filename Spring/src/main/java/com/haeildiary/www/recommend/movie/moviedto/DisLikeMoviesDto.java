package com.haeildiary.www.recommend.movie.moviedto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisLikeMoviesDto {
    private Integer dislikeId;
    private Integer movieKey;
    private LocalDateTime createdAt;
}
