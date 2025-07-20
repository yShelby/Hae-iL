<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/emotion/repository/TagRepository.java
package com.haeildiary.www.emotion.repository;

import com.haeildiary.www.emotion.entity.Tag;
========
package com.haeildairy.www.emotion.repository;

import com.haeildairy.www.emotion.entity.Tag;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/emotion/repository/TagRepository.java
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByTagName(String tagName);
}
