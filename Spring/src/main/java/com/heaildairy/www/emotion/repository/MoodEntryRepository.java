package com.heaildairy.www.emotion.repository;

import com.heaildairy.www.emotion.entity.MoodEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MoodEntryRepository extends JpaRepository<MoodEntry, Long> {

}
