package com.heaildairy.www.emotion.repository;

import com.heaildairy.www.emotion.entity.EmotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EmotionRepository extends JpaRepository<EmotionEntity, UUID> {

}
