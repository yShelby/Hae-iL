package com.haeildiary.www.recommend.movie.movieresponse;

import com.haeildiary.www.mood.dto.MoodDetailDTO;
import com.haeildiary.www.recommend.movie.moviedto.MovieDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collections;
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
    private List<MoodDetailDTO> moods;
    private boolean noChange = false; // 변경 여부 플래그 기본값 false

    public static MovieListResponse noChange() {
        return new MovieListResponse(
                Collections.emptyList(),          // combinedResults 빈 리스트
                Collections.emptyMap(),           // resultsByEmotion 빈 맵
                Collections.emptyList(),          // moods 빈 리스트
                true                             // noChange flag
        );
    }
}