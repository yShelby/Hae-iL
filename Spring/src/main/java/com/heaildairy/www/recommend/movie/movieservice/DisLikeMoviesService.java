package com.heaildairy.www.recommend.movie.movieservice;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.recommend.movie.moviedto.DisLikeMoviesDto;
import com.heaildairy.www.recommend.movie.movieentity.DisLikeMoviesEntity;
import com.heaildairy.www.recommend.movie.movierepository.DisLikeMoviesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisLikeMoviesService {


    @Autowired
    private UserRepository userRepository;  // userId로 조회할 수 있어야 함
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

    public void deleteDisLikeMovie(Integer dislikeId) {
        log.info("유저의 싫어요 영화 삭제요청 - userId: {}", dislikeId);
        disLikeMoviesRepository.deleteById(dislikeId);
    }

    public List<DisLikeMoviesDto> getDislikeMoviesByUserDto(Integer userId) {
        log.info("유저의 싫어요 영화 조회 - userId: {}", userId);
        List<DisLikeMoviesEntity> entities = disLikeMoviesRepository.findByUser_UserId(userId);

        return entities.stream()
                .map(entity -> new DisLikeMoviesDto(
                        entity.getDislikeId(),
                        entity.getMovieKey(),
                        entity.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
