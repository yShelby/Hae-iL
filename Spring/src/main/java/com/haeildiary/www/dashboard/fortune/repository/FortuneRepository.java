<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/fortune/repository/FortuneRepository.java
package com.haeildiary.www.dashboard.fortune.repository;

import com.haeildiary.www.dashboard.fortune.entity.FortuneEntity;
========
package com.haeildairy.www.dashboard.fortune.repository;

import com.haeildairy.www.dashboard.fortune.entity.FortuneEntity;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/fortune/repository/FortuneRepository.java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FortuneRepository extends JpaRepository<FortuneEntity, Integer> {

    @Query(value = "SELECT * FROM fortune_cookie ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<FortuneEntity> findRandomFortune();
}
