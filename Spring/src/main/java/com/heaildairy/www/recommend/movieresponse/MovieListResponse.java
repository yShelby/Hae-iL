package com.heaildairy.www.recommend.movieresponse;

import com.heaildairy.www.recommend.moviedto.MovieDTO;
import lombok.Getter;

import java.util.List;

/*
* TMDB에서 영화 목록을 조회한 후, 클라이언트에게 전달하기 위한 응답 객체입니다.
* 이 객체는 영화 목록을 포함하고 있으며, 각 영화는 MovieDTO 형태로 표현됩니다.
* */
@Getter
public class MovieListResponse {
    private List<MovieDTO> result;
}