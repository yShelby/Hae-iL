package com.heaildairy.www.diary.repository;

import com.heaildairy.www.diary.entity.DiaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DiaryRepository extends JpaRepository<DiaryEntity, UUID> {

}
