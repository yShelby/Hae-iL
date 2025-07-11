package com.heaildairy.www.emotion.repository;

import com.heaildairy.www.emotion.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findByTagName(String tagname);
}
