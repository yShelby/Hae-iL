package com.haeildiary.www.recommend.movie.movieservice;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.haeildiary.www.recommend.movie.movierepository.DisLikeMoviesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisLikeMoviesService {

    private final UserRepository userRepository;  // userId로 조회할 수 있어야 함
    private final DisLikeMoviesRepository disLikeMoviesRepository;

    public boolean saveDisLikeMovie(Integer movieKey, Integer userId){
        // 1. UserEntity 조회
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다. userId: " + userId));

        // 2. 이미 싫어요 표시한 영화인지 확인
        boolean alreadyExists = disLikeMoviesRepository.existsByUser_UserIdAndMovieKey(userId, movieKey);
        log.debug("dislikeMovies:{}", alreadyExists);

        if (alreadyExists) {
            log.info("이미 싫어요 표시된 영화입니다. userId: {}, movieKey: {}", userId, movieKey);
            return false;
        }

        // 3. 새로운 싫어요 영화 저장
        DisLikeMoviesEntity disLikeMoviesEntity = new DisLikeMoviesEntity();
        disLikeMoviesEntity.setUser(user);  // 엔티티 전체로 넣기
        disLikeMoviesEntity.setMovieKey(movieKey);

        disLikeMoviesRepository.save(disLikeMoviesEntity);
        log.info("싫어요가 추가되었습니다. userId: {}, movieKey: {}", userId, movieKey);

        return true;
    }

    // 매일 오전 10시에 실행
    @Scheduled(cron = "0 0 0 * * *")
    public void cleanOldDislikes() {
        LocalDateTime threshold = LocalDateTime.now().minusMonths(1);
        disLikeMoviesRepository.deleteOldDislikes(threshold);
        log.info("한 달 지난 싫어요 영화 데이터를 삭제했습니다.");
    }
}
