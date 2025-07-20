package com.haeildairy.www.dashboard.fortune.repository;

import com.haeildairy.www.dashboard.fortune.entity.FortuneEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FortuneRepository extends JpaRepository<FortuneEntity, Integer> {

    @Query(value = "SELECT * FROM fortune_cookie ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<FortuneEntity> findRandomFortune();
}
