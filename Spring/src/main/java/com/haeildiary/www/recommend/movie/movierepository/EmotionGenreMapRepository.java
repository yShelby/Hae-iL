package com.haeildiary.www.recommend.movie.movierepository;

import com.haeildiary.www.recommend.movie.movieentity.EmotionGenreMapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmotionGenreMapRepository extends JpaRepository<EmotionGenreMapEntity, Integer> {

    @Query("select e from EmotionGenreMapEntity e where e.moodType = :moodType order by e.genreWeight desc")
    List<EmotionGenreMapEntity> findByEmotionTypeOrdered(@Param("moodType") String emotionType);

}