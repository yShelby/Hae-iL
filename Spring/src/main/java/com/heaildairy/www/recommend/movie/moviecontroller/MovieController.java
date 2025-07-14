package com.heaildairy.www.recommend.movie.moviecontroller;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.diary.entity.DiaryEntity;
import com.heaildairy.www.diary.repository.DiaryRepository;
import com.heaildairy.www.emotion.entity.MoodDetail;
import com.heaildairy.www.emotion.repository.MoodDetailRepository;
import com.heaildairy.www.recommend.movie.moviedto.MovieDTO;
import com.heaildairy.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.heaildairy.www.recommend.movie.movieservice.DisLikeMoviesService;
import com.heaildairy.www.recommend.movie.movieservice.RecommendMovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/recommend/movies")
@RequiredArgsConstructor
public class MovieController {

    private final RecommendMovieService recommendMovieService;
    private final DisLikeMoviesService disLikeMoviesService;
    private final DiaryRepository diaryRepository;
    private final MoodDetailRepository moodDetailRepository;

    @GetMapping("/today") public  ResponseEntity<List<MovieDTO>> recommendTodayMovie(
            @AuthenticationPrincipal UserEntity user
    ) {
        LocalDate today = LocalDate.now();

        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(user.getUserId(), today);

        if (todayDiary.isPresent()) {
            DiaryEntity diary = todayDiary.get();
            List<MoodDetail> moods = moodDetailRepository.findByDiary(diary);

            if (!moods.isEmpty()) {
                String topEmotion = moods.stream()
                        .max(Comparator.comparing(MoodDetail::getPercentage))
                        .map(MoodDetail::getEmotionType)
                        .orElse(null);

                if (topEmotion != null && !topEmotion.equalsIgnoreCase("중립/기타")) {
                    List<MovieDTO> movies = recommendMovieService.recommendByEmotion(topEmotion, user);
                    return movies.isEmpty()
                            ? ResponseEntity.noContent().build()
                            : ResponseEntity.ok(movies);
                }
            }
        }
        List<MovieDTO> fallback = recommendMovieService.recommendByInitialSurvey(user);
        return fallback.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(fallback);
    }

    /*
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
    /*
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
    /*
     * 싫어요 영화 삭제
     */
    @DeleteMapping("/{disLikeId}")
    public ResponseEntity<String> deleteDisLikeMovie(@RequestParam Integer disLikeId){
        disLikeMoviesService.deleteDisLikeMovie(disLikeId);
        return ResponseEntity.ok("싫어요한 영화가 삭제되었습니다.");
    }
    /*
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
