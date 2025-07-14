package com.heaildairy.www.recommend.movierepository;

import com.heaildairy.www.recommend.movieentity.DisLikeMoviesEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisLikeMoviesRepository extends JpaRepository<DisLikeMoviesEntity, Integer> {

        /**
         * 특정 사용자가 싫어하는 영화 목록을 조회합니다.
         *
         * @param userId 조회할 사용자의 고유 ID
         * @return 해당 사용자가 싫어하는 영화 리스트
         */
        List<DisLikeMoviesEntity> findByUser_UserId(Integer userId);

        /**
         * 특정 사용자가 특정 영화를 싫어하는지 여부를 확인합니다.
         *
         * @param userId 조회할 사용자의 고유 ID
         * @param movieKey 조회할 영화 키
         * @return 해당 사용자가 해당 영화를 싫어하면 true, 아니면 false
         */
        boolean existsByUser_UserIdAndMovieKey(Integer userId, String movieKey);
}
