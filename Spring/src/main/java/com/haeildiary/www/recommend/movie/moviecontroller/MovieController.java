package com.haeildiary.www.recommend.movie.moviecontroller;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.diary.entity.DiaryEntity;
import com.haeildiary.www.diary.repository.DiaryRepository;
import com.haeildiary.www.mood.entity.MoodDetail;
import com.haeildiary.www.mood.repository.MoodDetailRepository;
import com.haeildiary.www.recommend.movie.moviedto.MovieDto;
import com.haeildiary.www.recommend.movie.movieresponse.MovieListResponse;
import com.haeildiary.www.recommend.movie.movieservice.*;
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
    private final MoodCacheService moodCacheService;
    private final RecommendationCacheService recommendationCacheService;

    /**
     * 오늘 작성한 일기 기반 감정을 조회하여 그 감정에 맞는 영화 추천
     * 인증된 사용자만 접근 가능
     */
    @GetMapping
    public ResponseEntity<MovieListResponse> recommendByTodayWeightedEmotion(
            @AuthenticationPrincipal CustomUser customUser) {

        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserEntity user = userRepository.findById(customUser.getUserId())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 오늘 일기 감정 가져오기
        List<MoodDetail> todayMoods = List.of();
        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(user.getUserId(), LocalDate.now());
        if (todayDiary.isPresent()) {
            todayMoods = moodDetailRepository.findByDiaryDiaryId(todayDiary.get().getDiaryId());
        }
        log.info("todayMoods : {}", todayMoods);

        // 캐시된 감정 데이터 가져오기
        List<MoodDetail> cachedMoods = moodCacheService.getCachedMoods(user.getUserId());

        boolean containsNeutralOrEtc = todayMoods.stream()
                .anyMatch(mood -> "중립/기타".equals(mood.getMoodType()));

        MovieListResponse response;

        // 감정 데이터 비교 (간단히 equals 이용, 필요 시 더 정밀 비교)
        if (recommendByMoodService.moodsAreSame(todayMoods, cachedMoods)) {
            // 감정이 같으면 캐시된 추천 결과를 불러온다
            response = recommendationCacheService.getCachedRecommendation(user.getUserId());
            if (response == null) {
                // 캐시가 없으면 새 추천 수행
                if (!todayMoods.isEmpty() && !containsNeutralOrEtc) {
                    response = recommendByMoodService.recommendByTodayDiaryWeighted(user);
                } else {
                    response = recommendByInitialService.recommendByInitialSurvey(user);
                }
                recommendationCacheService.updateCachedRecommendation(user.getUserId(), response);
            }
        } else {
            // 감정 다르면 새 추천 수행
            if (!todayMoods.isEmpty() && !containsNeutralOrEtc) {
                response = recommendByMoodService.recommendByTodayDiaryWeighted(user);
            } else {
                response = recommendByInitialService.recommendByInitialSurvey(user);
            }
            // 캐시에 감정 데이터 업데이트
            moodCacheService.updateCachedMoods(user.getUserId(), todayMoods);
            recommendationCacheService.updateCachedRecommendation(user.getUserId(), response);

            // 추천 결과 캐시도 업데이트 필요
            /* 캐시된 추천 결과 저장 로직 추가 */
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/refresh")
    public ResponseEntity<MovieListResponse> refreshRecommendation(
            @AuthenticationPrincipal CustomUser customUser) {

        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserEntity user = userRepository.findById(customUser.getUserId())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 오늘 일기 감정 가져오기
        List<MoodDetail> todayMoods = List.of();
        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(user.getUserId(), LocalDate.now());
        if (todayDiary.isPresent()) {
            todayMoods = moodDetailRepository.findByDiaryDiaryId(todayDiary.get().getDiaryId());
        }

        boolean containsNeutralOrEtc = todayMoods.stream()
                .anyMatch(mood -> "중립/기타".equals(mood.getMoodType()));

        MovieListResponse response;

            if (!todayMoods.isEmpty() && !containsNeutralOrEtc) {
                response = recommendByMoodService.recommendByTodayDiaryWeighted(user);
            } else {
                response = recommendByInitialService.recommendByInitialSurvey(user);
            }
            // 캐시에 감정 데이터 업데이트
            moodCacheService.updateCachedMoods(user.getUserId(), todayMoods);
            recommendationCacheService.updateCachedRecommendation(user.getUserId(), response);

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
