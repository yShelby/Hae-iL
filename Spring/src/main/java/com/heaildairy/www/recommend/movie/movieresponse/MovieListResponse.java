package com.heaildairy.www.recommend.movie.movieresponse;

import com.heaildairy.www.emotion.dto.MoodDetailDto;
import com.heaildairy.www.recommend.movie.moviedto.MovieDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

/*
 * TMDB에서 영화 목록을 조회한 후, 클라이언트에게 전달하기 위한 응답 객체입니다.
 * 이 객체는 영화 목록을 포함하고 있으며, 각 영화는 MovieDTO 형태로 표현됩니다.
 * */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieListResponse {
    private List<MovieDto> combinedResults;
    private Map<String, List<MovieDto>> resultsByEmotion;
    private List<MoodDetailDto> moods;
}