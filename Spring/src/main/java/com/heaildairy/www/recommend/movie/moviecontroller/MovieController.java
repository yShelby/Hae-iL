//package com.heaildairy.www.recommend.movie.moviecontroller;
//
//import com.heaildairy.www.auth.entity.UserEntity;
//import com.heaildairy.www.diary.entity.DiaryEntity;
//import com.heaildairy.www.diary.repository.DiaryRepository;
//import com.heaildairy.www.emotion.entity.MoodDetail;
//import com.heaildairy.www.emotion.repository.MoodDetailRepository;
//import com.heaildairy.www.recommend.movie.moviedto.MovieDTO;
//import com.heaildairy.www.recommend.movie.movieentity.DisLikeMoviesEntity;
//import com.heaildairy.www.recommend.movie.movieservice.DisLikeMoviesService;
//import com.heaildairy.www.recommend.movie.movieservice.RecommendMovieService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDate;
//import java.util.Comparator;
//import java.util.List;
//import java.util.Optional;
//
//@Slf4j
//@RestController
//@RequestMapping("api/recommend/movies")
//@RequiredArgsConstructor
//public class MovieController {
//
//    private final RecommendMovieService recommendMovieService;
//    private final DisLikeMoviesService disLikeMoviesService;
//    private final DiaryRepository diaryRepository;
//    private final MoodDetailRepository moodDetailRepository;
//
//    @GetMapping
//    public ResponseEntity<List<MovieDTO>> recommendTodayMovie(
//            @AuthenticationPrincipal UserEntity user
//    ) {
//        log.info("오늘 추천 요청 사용자: {}", (user != null ? user.getEmail() : "null"));
//
//        if (user == null) {
//            log.warn("인증된 사용자가 아닙니다.");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        LocalDate today = LocalDate.now();
//
//        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(user.getUserId(), today);
//
//        if (todayDiary.isPresent()) {
//            DiaryEntity diary = todayDiary.get();
//            List<MoodDetail> moods = moodDetailRepository.findByDiaryDiaryId(diary.getDiaryId());
//
//            if (!moods.isEmpty()) {
//                String topEmotion = moods.stream()
//                        .max(Comparator.comparing(MoodDetail::getPercentage))
//                        .map(MoodDetail::getEmotionType)
//                        .orElse(null);
//
//                log.info("오늘 추천 요청 감정: {}", topEmotion);
//
//                if (topEmotion != null && !topEmotion.equalsIgnoreCase("중립/기타")) {
//                    List<MovieDTO> movies = recommendMovieService.recommendByEmotion(topEmotion, user);
//                    if (movies.isEmpty()) {
//                        log.info("추천 영화가 없습니다.");
//                        return ResponseEntity.noContent().build();
//                    }
//                    return ResponseEntity.ok(movies);
//                }
//            } else {
//                log.info("오늘 일기 감정 정보가 없습니다.");
//            }
//        } else {
//            log.info("오늘 일기가 없습니다.");
//        }
//
//        List<MovieDTO> fallback = recommendMovieService.recommendByInitialSurvey(user);
//        if (fallback.isEmpty()) {
//            log.info("초기 설문 기반 추천 결과가 없습니다.");
//            return ResponseEntity.noContent().build();
//        }
//        return ResponseEntity.ok(fallback);
//    }
//
//    @PostMapping
//    public ResponseEntity<List<MovieDTO>> recommendByEmotion(
//            @RequestParam String emotionType,
//            @AuthenticationPrincipal UserEntity user
//    ) {
//        log.info("추천 요청 감정: {}", emotionType);
//        log.info("추천 요청 사용자: {}", (user != null ? user.getEmail() : "null"));
//
//        if (user == null) {
//            log.warn("❌ 인증 안 된 사용자 요청");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        List<MovieDTO> movies = recommendMovieService.recommendByEmotion(emotionType, user);
//        if (movies == null || movies.isEmpty()) {
//            log.info("추천 영화가 없습니다.");
//            return ResponseEntity.noContent().build();
//        }
//        return ResponseEntity.ok(movies);
//    }
//
//    @PostMapping("/dislike")
//    public ResponseEntity<String> saveDislikeMovie(
//            @RequestParam String movieKey,
//            @AuthenticationPrincipal UserEntity user
//    ) {
//        log.info("싫어요 영화 저장 요청: movieKey={}, user={}", movieKey, (user != null ? user.getEmail() : "null"));
//
//        if (user == null) {
//            log.warn("❌ 인증 안 된 사용자 요청");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증이 필요합니다.");
//        }
//
//        boolean saved = disLikeMoviesService.saveDisLikeMovie(movieKey, user);
//        if (saved) {
//            log.info("영화가 싫어요로 등록되었습니다. movieKey={}", movieKey);
//            return ResponseEntity.ok("영화가 싫어요로 등록되었습니다.");
//        } else {
//            log.info("이미 싫어요한 영화입니다. movieKey={}", movieKey);
//            return ResponseEntity.badRequest().body("이미 싫어요한 영화입니다.");
//        }
//    }
//
//    @DeleteMapping("/{disLikeId}")
//    public ResponseEntity<String> deleteDisLikeMovie(@RequestParam Integer disLikeId) {
//        log.info("싫어요 영화 삭제 요청: disLikeId={}", disLikeId);
//        disLikeMoviesService.deleteDisLikeMovie(disLikeId);
//        return ResponseEntity.ok("싫어요한 영화가 삭제되었습니다.");
//    }
//
//    @GetMapping("/dislike")
//    public ResponseEntity<?> checkDisLikeMovie(
//            @RequestParam Integer userId
//    ) {
//        log.info("사용자 싫어요 영화 조회 요청: userId={}", userId);
//        List<DisLikeMoviesEntity> exists = disLikeMoviesService.getDislikeMoviesByUser(userId);
//        if (exists.isEmpty()) {
//            log.info("싫어요한 영화가 없습니다. userId={}", userId);
//            return ResponseEntity.ok("싫어요한 영화가 없습니다.");
//        } else {
//            return ResponseEntity.ok(exists);
//        }
//    }
//
//}
//

package com.heaildairy.www.recommend.movie.moviecontroller;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.diary.entity.DiaryEntity;
import com.heaildairy.www.diary.repository.DiaryRepository;
import com.heaildairy.www.emotion.entity.MoodDetail;
import com.heaildairy.www.emotion.repository.MoodDetailRepository;
import com.heaildairy.www.recommend.movie.moviedto.MovieDto;
import com.heaildairy.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.heaildairy.www.recommend.movie.movieservice.DisLikeMoviesService;
import com.heaildairy.www.recommend.movie.movieservice.RecommendMovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("api/recommend/movies")
@RequiredArgsConstructor
public class MovieController {

    private final RecommendMovieService recommendMovieService;
    private final DisLikeMoviesService disLikeMoviesService;
    private final DiaryRepository diaryRepository;
    private final MoodDetailRepository moodDetailRepository;
    private final UserRepository userRepository;


    /**
     * 오늘 작성한 일기 기반 감정을 조회하여 그 감정에 맞는 영화 추천
     * 인증된 사용자만 접근 가능
     */
    @GetMapping
    public ResponseEntity<List<MovieDto>> recommendTodayMovie(
            @AuthenticationPrincipal CustomUser customUser) {

        log.info("인증 사용자: {}", customUser);

        // 인증 여부 확인
        if (customUser == null) {
            log.warn("❌ 인증된 사용자가 아닙니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // userId 꺼내서 UserEntity 다시 조회
        Integer userId = customUser.getUserId();
        Optional<UserEntity> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            log.warn("❌ 사용자 정보가 존재하지 않습니다. userId={}", userId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserEntity user = userOpt.get();  // 이제 진짜 UserEntity 확보

        // 오늘 날짜 일기 조회
        LocalDate today = LocalDate.now();
        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(userId, today);

        if (todayDiary.isPresent()) {
            DiaryEntity diary = todayDiary.get();
            List<MoodDetail> moods = moodDetailRepository.findByDiaryDiaryId(diary.getDiaryId());

            if (!moods.isEmpty()) {
                String topEmotion = moods.stream()
                        .max(Comparator.comparing(MoodDetail::getPercentage))
                        .map(MoodDetail::getEmotionType)
                        .orElse(null);

                log.info("🎯 감정 분석 결과: {}", topEmotion);

                if (topEmotion != null && !topEmotion.equalsIgnoreCase("중립/기타")) {
                    List<MovieDto> movies = recommendMovieService.recommendByEmotion(topEmotion, user);
                    if (!movies.isEmpty()) {
                        return ResponseEntity.ok(movies);
                    }
                    log.info("🎬 해당 감정에 맞는 영화 추천 결과가 없습니다.");
                    return ResponseEntity.noContent().build();
                }
            } else {
                log.info("📭 감정 정보가 없습니다.");
            }
        } else {
            log.info("📭 오늘 작성된 일기가 없습니다.");
        }

        // Fallback: 초기 설문 기반 추천
        List<MovieDto> fallback = recommendMovieService.recommendByInitialSurvey(user);
        if (fallback.isEmpty()) {
            log.info("초기 설문 기반 추천 결과 없음");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(fallback);
    }

    /**
     * 클라이언트에서 감정을 직접 보내서 해당 감정 기반 영화 추천 요청
     * 인증된 사용자만 접근 가능
     */
//    @PostMapping
//    public ResponseEntity<List<MovieDTO>> recommendByEmotion(
//            @AuthenticationPrincipal UserEntity user
//    ) {
//        log.info("추천 요청 감정: {}", emotionType);
//        log.info("추천 요청 사용자: {}", (user != null ? user.getEmail() : "null"));
//
//        if (user == null) {
//            log.warn("❌ 인증 안 된 사용자 요청");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        List<MovieDTO> movies = recommendMovieService.recommendByEmotion(emotionType, user);
//        if (movies == null || movies.isEmpty()) {
//            log.info("추천 영화가 없습니다.");
//            return ResponseEntity.noContent().build();
//        }
//        return ResponseEntity.ok(movies);
//    }

    /**
     * 사용자가 특정 영화를 '싫어요'로 저장 요청
     * 인증된 사용자만 접근 가능
     */
    @PostMapping("/dislike")
    public ResponseEntity<String> saveDislikeMovie(
            @RequestParam String movieKey,
            @AuthenticationPrincipal UserEntity user
    ) {
        log.info("싫어요 영화 저장 요청: movieKey={}, user={}", movieKey, (user != null ? user.getEmail() : "null"));

        if (user == null) {
            log.warn("❌ 인증 안 된 사용자 요청");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증이 필요합니다.");
        }

        boolean saved = disLikeMoviesService.saveDisLikeMovie(movieKey, user);
        if (saved) {
            log.info("영화가 싫어요로 등록되었습니다. movieKey={}", movieKey);
            return ResponseEntity.ok("영화가 싫어요로 등록되었습니다.");
        } else {
            log.info("이미 싫어요한 영화입니다. movieKey={}", movieKey);
            return ResponseEntity.badRequest().body("이미 싫어요한 영화입니다.");
        }
    }

    /**
     * 사용자가 저장한 '싫어요' 영화 삭제 요청
     */
    @DeleteMapping("/{disLikeId}")
    public ResponseEntity<String> deleteDisLikeMovie(@RequestParam Integer disLikeId) {
        log.info("싫어요 영화 삭제 요청: disLikeId={}", disLikeId);
        disLikeMoviesService.deleteDisLikeMovie(disLikeId);
        return ResponseEntity.ok("싫어요한 영화가 삭제되었습니다.");
    }

    /**
     * 특정 사용자의 '싫어요' 영화 리스트 조회
     */
    @GetMapping("/dislike")
    public ResponseEntity<?> checkDisLikeMovie(
            @RequestParam Integer userId
    ) {
        log.info("사용자 싫어요 영화 조회 요청: userId={}", userId);
        List<DisLikeMoviesEntity> exists = disLikeMoviesService.getDislikeMoviesByUser(userId);
        if (exists.isEmpty()) {
            log.info("싫어요한 영화가 없습니다. userId={}", userId);
            return ResponseEntity.ok("싫어요한 영화가 없습니다.");
        } else {
            return ResponseEntity.ok(exists);
        }
    }

}
