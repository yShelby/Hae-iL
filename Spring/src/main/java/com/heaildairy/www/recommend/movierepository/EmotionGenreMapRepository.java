package com.heaildairy.www.recommend.movierepository;

import com.heaildairy.www.recommend.movieentity.EmotionGenreMapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmotionGenreMapRepository extends JpaRepository<EmotionGenreMapEntity, Integer> {

    @Query("select e from EmotionGenreMapEntity e where e.emotionType = :emotionType order by e.genreWeight desc")
    List<EmotionGenreMapEntity> findByEmotionTypeOrdered(@Param("emotionType") String emotionType);

}