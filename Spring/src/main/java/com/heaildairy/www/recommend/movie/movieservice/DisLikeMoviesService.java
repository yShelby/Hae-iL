package com.heaildairy.www.recommend.movie.movieservice;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.recommend.movie.moviedto.DisLikeMoviesDto;
import com.heaildairy.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.heaildairy.www.recommend.movie.movierepository.DisLikeMoviesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisLikeMoviesService {

    private final DisLikeMoviesRepository disLikeMoviesRepository;

    public List<DisLikeMoviesDto> findDislikeMoviesByUser(Integer userId){
        List<DisLikeMoviesEntity> disLikeMoviesEntities = disLikeMoviesRepository.findByUser_UserId(userId);
        return disLikeMoviesEntities.stream()
                .map(disLikeMoviesEntity -> {
                    DisLikeMoviesDto disLikeMoviesDTO = new DisLikeMoviesDto();
                    disLikeMoviesDTO.setDislikeId(disLikeMoviesEntity.getDislikeId());
                    disLikeMoviesDTO.setMovieKey(disLikeMoviesEntity.getMovieKey());
                    return disLikeMoviesDTO;
                })
                .collect(Collectors.toList());

    }

    public boolean saveDisLikeMovie(String movieKey, UserEntity user){
        boolean alreadyExists = disLikeMoviesRepository.existsByUser_UserIdAndMovieKey(user.getUserId(), movieKey);
        log.debug("dislikeMovies:{}",alreadyExists);

        if (alreadyExists){
            log.info("이미 싫어요 표시된 영화입니다. userId: {}, movieKey: {}", user.getUserId(), movieKey);
            return false;
        }
        DisLikeMoviesEntity disLikeMoviesEntity = new DisLikeMoviesEntity();
        disLikeMoviesEntity.setUser(user);
        disLikeMoviesEntity.setMovieKey(movieKey);

        log.info("싫어요가 추가되었습니다. userId: {}, movieKey: {}", user.getUserId(), movieKey);
        disLikeMoviesRepository.save(disLikeMoviesEntity);

        return true;
    }

    public void deleteDisLikeMovie(Integer dislikeId) {
        log.info("유저의 싫어요 영화 삭제요청 - userId: {}", dislikeId);
        disLikeMoviesRepository.deleteById(dislikeId);
    }

    public List<DisLikeMoviesEntity> getDislikeMoviesByUser(Integer userId) {
        log.info("유저의 싫어요 영화 조회 - userId: {}", userId);
        return disLikeMoviesRepository.findByUser_UserId(userId);
    }
}
