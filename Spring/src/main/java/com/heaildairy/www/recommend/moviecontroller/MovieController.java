package com.heaildairy.www.recommend.moviecontroller;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.recommend.moviedto.MovieDTO;
import com.heaildairy.www.recommend.movieentity.DisLikeMoviesEntity;
import com.heaildairy.www.recommend.movieservice.DisLikeMoviesService;
import com.heaildairy.www.recommend.movieservice.RecommendMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class MovieController {

    private final RecommendMovieService recommendMovieService;
    private final DisLikeMoviesService disLikeMoviesService;

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

    @PostMapping
    public ResponseEntity<String> saveDislikeMovie(
            @RequestParam String movieKey,
            @RequestAttribute UserEntity user  // 예: 인터셉터, 필터 또는 시큐리티에서 주입
    ) {
        boolean saved = disLikeMoviesService.saveDisLikeMovie(movieKey, user);
        if (saved) {
            return ResponseEntity.ok("영화가 싫어요로 등록되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("이미 싫어요한 영화입니다.");
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteDisLikeMovie(@RequestParam Integer disLikeId){
        disLikeMoviesService.deleteDisLikeMovie(disLikeId);
        return ResponseEntity.ok("싫어요한 영화가 삭제되었습니다.");
    }

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
