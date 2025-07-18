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
import com.heaildairy.www.emotion.dto.FlaskResponseDto;
import com.heaildairy.www.emotion.entity.MoodDetail;
import com.heaildairy.www.emotion.repository.MoodDetailRepository;
import com.heaildairy.www.emotion.service.FlaskService;
import com.heaildairy.www.recommend.movie.moviedto.DisLikeMoviesDto;
import com.heaildairy.www.recommend.movie.moviedto.MovieDto;
import com.heaildairy.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.heaildairy.www.recommend.movie.movieresponse.MovieListResponse;
import com.heaildairy.www.recommend.movie.movieservice.DisLikeMoviesService;
import com.heaildairy.www.recommend.movie.movieservice.RecommendMovieService;
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

    private final RecommendMovieService recommendMovieService;
    private final DisLikeMoviesService disLikeMoviesService;
    private final DiaryRepository diaryRepository;
    private final MoodDetailRepository moodDetailRepository;
    private final UserRepository userRepository;
    /**
     * 오늘 작성한 일기 기반 감정을 조회하여 그 감정에 맞는 영화 추천
     * 인증된 사용자만 접근 가능
     */

//    @GetMapping()
//    public ResponseEntity<List<MovieDto>> recommendByTodayWeightedEmotion(
//            @AuthenticationPrincipal CustomUser customUser) {
//        if (customUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//
//        Optional<UserEntity> userOpt = userRepository.findById(customUser.getUserId());
//        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//
////        List<MovieDto> recommended = recommendMovieService.recommendByTodayDiaryWeighted(userOpt.get());
////        return recommended.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(recommended);
//        // ⚠️ 변경된 서비스 메소드 호출 (영화 + 감정 모두 포함)
//        MovieListResponse response = (MovieListResponse) recommendMovieService.recommendByTodayDiaryWeighted(userOpt.get());
//
//        if (response.getResults().isEmpty()) {
//            return ResponseEntity.noContent().build();
//        }
//
//        return ResponseEntity.ok(response.getResults());
//    }

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
            response = recommendMovieService.recommendByTodayDiaryWeighted(user);
            log.info("📌 오늘 일기 기반 감정 추천 실행 - userId: {}", user.getUserId());
        } else {
            List<MovieDto> movies = recommendMovieService.recommendByInitialSurvey(user);
            response = new MovieListResponse(movies, Map.of(), List.of());
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

//    @GetMapping
//    public ResponseEntity<MovieListResponse> recommendByTodayWeightedEmotion(
//            @AuthenticationPrincipal CustomUser customUser) {
//
//        if (customUser == null) {
//            log.warn("❌ 인증 안 된 사용자 요청");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//        Optional<UserEntity> userOpt = userRepository.findById(customUser.getUserId());
//        if (userOpt.isEmpty()) {
//            log.warn("❌ 사용자 ID로 조회 실패 - userId: {}", customUser.getUserId());
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        // 🎯 감정 + 영화 DTO 포함 응답
//        MovieListResponse response = recommendMovieService.recommendByTodayDiaryWeighted(userOpt.get());
//
//        // ✅ 디버깅 로그 추가
//        log.info("📌 감정 기반 추천 응답 생성 완료 - userId: {}", userOpt.get().getUserId());
//        log.info("moods: {}", response.getMoods());
//        log.info("combinedResults: {}", response.getCombinedResults());
//        log.info("resultsByEmotion: {}", response.getResultsByEmotion());
//
//        if (response.getCombinedResults().isEmpty() || response.getResultsByEmotion().isEmpty()) {
//            log.info("🔍 추천 결과 없음 - userId: {}", userOpt.get().getUserId());
//            return ResponseEntity.ok(response); // ❗ 감정(moods)는 있으니 결과 보내기
//        }
//
//        return ResponseEntity.ok(response);
//    }


//    @GetMapping("/top3/today")
//    public ResponseEntity<Map<String, List<MovieDto>>> recommendByTodayTop3Emotions(
//            @AuthenticationPrincipal CustomUser customUser) {
//
//        if (customUser == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        Integer userId = customUser.getUserId();
//        Optional<UserEntity> userOpt = userRepository.findById(userId);
//        if (userOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//        UserEntity user = userOpt.get();
//
//        Optional<DiaryEntity> todayDiary = diaryRepository.findByUserUserIdAndDiaryDate(userId, LocalDate.now());
//        if (todayDiary.isEmpty()) {
//            return ResponseEntity.noContent().build();
//        }
//
//        List<MoodDetail> moods = moodDetailRepository.findByDiaryDiaryId(todayDiary.get().getDiaryId());
//        if (moods.isEmpty()) {
//            return ResponseEntity.noContent().build();
//        }
//
//        // 상위 3개 감정 추출
//        List<MoodDetail> top3Moods = moods.stream()
//                .sorted(Comparator.comparing(MoodDetail::getPercentage).reversed())
//                .toList();
//
//        Map<String, List<MovieDto>> result = new LinkedHashMap<>();
//        for (MoodDetail mood : top3Moods) {
//            if (!mood.getEmotionType().equalsIgnoreCase("중립/기타")) {
//                List<MovieDto> movies = recommendMovieService.recommendByEmotion(mood.getEmotionType(), user);
//                result.put(mood.getEmotionType(), movies);
//            }
//        }
//
//        if (result.isEmpty()) {
//            return ResponseEntity.noContent().build();
//        }
//        return ResponseEntity.ok(result);
//    }


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

    /**
     * 사용자가 저장한 '싫어요' 영화 삭제 요청
     */
    @DeleteMapping("/{disLikeId}")
    public ResponseEntity<String> deleteDisLikeMovie(@PathVariable Integer disLikeId) {
        log.info("싫어요 영화 삭제 요청: disLikeId={}", disLikeId);
        disLikeMoviesService.deleteDisLikeMovie(disLikeId);
        return ResponseEntity.ok("싫어요한 영화가 삭제되었습니다.");
    }

    /**
     * 특정 사용자의 '싫어요' 영화 리스트 조회
     */
    @GetMapping("/dislike")
    public ResponseEntity<List<DisLikeMoviesDto>> getDislikedMovies(
            @AuthenticationPrincipal CustomUser user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<DisLikeMoviesDto> dislikedMovies = disLikeMoviesService.getDislikeMoviesByUserDto(user.getUserId());
        return ResponseEntity.ok(dislikedMovies);
    }
}
