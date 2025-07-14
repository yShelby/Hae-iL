package com.heaildairy.www.recommend.movie.moviecontroller;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.recommend.movie.moviedto.MovieDTO;
import com.heaildairy.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.heaildairy.www.recommend.movie.movieservice.DisLikeMoviesService;
import com.heaildairy.www.recommend.movie.movieservice.RecommendMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/recommend/movies")
@RequiredArgsConstructor
public class MovieController {

    private final RecommendMovieService recommendMovieService;
    private final DisLikeMoviesService disLikeMoviesService;

    /**
     * 감정 기반 또는 설문 기반 영화 추천
     */
    @PostMapping
    public ResponseEntity<List<MovieDTO>> recommendByEmotion(
            @RequestParam String emotionType,
            @AuthenticationPrincipal UserEntity user
    ){
        List<MovieDTO> movies = recommendMovieService.recommendByEmotion(emotionType, user);
        if (movies == null || movies.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(movies);
    }
    /**
     * 싫어요 영화 저장
     */
    @PostMapping("/dislike")
    public ResponseEntity<String> saveDislikeMovie(
            @RequestParam String movieKey,
            @AuthenticationPrincipal UserEntity user  // 예: 인터셉터, 필터 또는 시큐리티에서 주입
    ) {
        boolean saved = disLikeMoviesService.saveDisLikeMovie(movieKey, user);
        if (saved) {
            return ResponseEntity.ok("영화가 싫어요로 등록되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("이미 싫어요한 영화입니다.");
        }
    }
    /**
     * 싫어요 영화 삭제
     */
    @DeleteMapping("/{disLikeId}")
    public ResponseEntity<String> deleteDisLikeMovie(@RequestParam Integer disLikeId){
        disLikeMoviesService.deleteDisLikeMovie(disLikeId);
        return ResponseEntity.ok("싫어요한 영화가 삭제되었습니다.");
    }
    /**
     * 사용자의 싫어요 영화 조회
     */
    @GetMapping
    public ResponseEntity<?> checkDisLikeMovie(
            @RequestParam Integer userId
    ){
        List<DisLikeMoviesEntity> exists = disLikeMoviesService.getDislikeMoviesByUser(userId);
        if (exists.isEmpty()) {
            return ResponseEntity.ok("싫어요한 영화가 없습니다.");
        } else {
            return ResponseEntity.ok(exists);
        }
    }

}
