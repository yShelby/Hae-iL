package com.heaildairy.www.recommend.movie.movieservice;

import com.heaildairy.www.recommend.movie.movierepository.DisLikeMoviesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class DisLikeMovieSchedulerService {

    private final DisLikeMoviesRepository disLikeMoviesRepository;

    // 매일 새벽 3시에 실행
    @Scheduled(cron = "0 0 10 * * *")
    public void cleanOldDislikes() {
        LocalDateTime threshold = LocalDateTime.now().minusMonths(1);
        disLikeMoviesRepository.deleteOldDislikes(threshold);
        log.info("한 달 지난 싫어요 영화 데이터를 삭제했습니다.");
    }
}
