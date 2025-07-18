package com.heaildairy.www.recommend.movie.moviecontroller;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.diary.entity.DiaryEntity;
import com.heaildairy.www.diary.repository.DiaryRepository;
import com.heaildairy.www.emotion.entity.MoodDetail;
import com.heaildairy.www.emotion.repository.MoodDetailRepository;
import com.heaildairy.www.recommend.movie.moviedto.MovieDto;
import com.heaildairy.www.recommend.movie.movieresponse.MovieListResponse;
import com.heaildairy.www.recommend.movie.movieservice.DisLikeMoviesService;
import com.heaildairy.www.recommend.movie.movieservice.RecommendByInitialService;
import com.heaildairy.www.recommend.movie.movieservice.RecommendByMoodService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("api/recommend/movies")
@RequiredArgsConstructor
public class MovieController {

    private final RecommendByMoodService recommendByMoodService;
    private final DisLikeMoviesService disLikeMoviesService;
    private final DiaryRepository diaryRepository;
    private final MoodDetailRepository moodDetailRepository;
    private final UserRepository userRepository;
    private final RecommendByInitialService recommendByInitialService;
    /**
     * 오늘 작성한 일기 기반 감정을 조회하여 그 감정에 맞는 영화 추천
     * 인증된 사용자만 접근 가능
     */
    @GetMapping
    public ResponseEntity<MovieListResponse> recommendByTodayWeightedEmotion(
            @AuthenticationPrincipal CustomUser customUser) {

        if (customUser == null) {
            log.warn("❌ 인증 안 된 사용자 요청");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<UserEntity> userOpt = userRepository.findById(customUser.getUserId());
        if (userOpt.isEmpty()) {
            log.warn("❌ 사용자 ID로 조회 실패 - userId: {}", customUser.getUserId());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserEntity user = userOpt.get();
        log.info("🔎 사용자 조회 성공 - userId: {}", user.getUserId());

        // 오늘 일기 조회
        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(user.getUserId(), LocalDate.now());

        boolean hasEmotion = false;
        if (todayDiary.isPresent()) {
            log.info("📅 오늘 일기 발견 - diaryId: {}", todayDiary.get().getDiaryId());
            List<MoodDetail> moodDetails = moodDetailRepository.findByDiaryDiaryId(todayDiary.get().getDiaryId());
            log.info("🎭 오늘 일기 감정 개수: {}", moodDetails.size());
            if (!moodDetails.isEmpty()) {
                hasEmotion = true;
                log.info("✅ 오늘 일기에 감정 데이터 있음");
            } else {
                log.info("⚠️ 오늘 일기 감정 데이터 없음");
            }
        } else {
            log.info("⚠️ 오늘 일기 없음");
        }

        MovieListResponse response;

        if (hasEmotion) {
            response = recommendByMoodService.recommendByTodayDiaryWeighted(user);
            log.info("📌 오늘 일기 기반 감정 추천 실행 - userId: {}", user.getUserId());
        } else {
            List<MovieDto> movies = recommendByInitialService.recommendByInitialSurvey(user);
            response = new MovieListResponse(movies, Map.of(), List.of(), false);
            log.info("📌 초기 설문 기반 추천 실행 - userId: {}", user.getUserId());
        }

        log.info("moods: {}", response.getMoods());
        log.info("combinedResults: {}", response.getCombinedResults());
        log.info("resultsByEmotion: {}", response.getResultsByEmotion());

        if (response.getCombinedResults().isEmpty() && response.getResultsByEmotion().isEmpty()) {
            log.info("🔍 추천 결과 없음 - userId: {}", user.getUserId());
        }

        return ResponseEntity.ok(response);
    }

    /**
     * 사용자가 특정 영화를 '싫어요'로 저장 요청
     * 인증된 사용자만 접근 가능
     */
    @PostMapping("/dislike")
    public ResponseEntity<String> saveDislikeMovie(
            @RequestParam Integer movieKey,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        log.info("싫어요 영화 저장 요청: movieKey={}, user={}", movieKey, (customUser != null ? customUser.getUserId() : "null"));

        if (customUser == null) {
            log.warn("❌ 인증 안 된 사용자 요청");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증이 필요합니다.");
        }

        boolean saved = disLikeMoviesService.saveDisLikeMovie(movieKey, customUser.getUserId());
        if (saved) {
            log.info("영화가 싫어요로 등록되었습니다. movieKey={}", movieKey);
            return ResponseEntity.ok("영화가 싫어요로 등록되었습니다.");
        } else {
            log.info("이미 싫어요한 영화입니다. movieKey={}", movieKey);
            return ResponseEntity.badRequest().body("이미 싫어요한 영화입니다.");
        }
    }
}
