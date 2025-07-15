package com.haeildairy.www.gallery.repository;

import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.gallery.entity.GalleryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * 📚 GalleryRepository.java
 * ──────────────────────────────
 * ✅ 역할:
 * - GalleryEntity(이미지 엔티티)의 데이터베이스 접근 계층 (JPA Repository)
 * - 이미지 데이터 조회, 검색, 정렬 기능 제공
 *
 * 📊 데이터 흐름도
 * 1️⃣ 사용자 ID를 기준으로 이미지 목록 조회 (최신 날짜 순)
 * 2️⃣ 특정 일기 ID로 해당 일기에 첨부된 이미지 단일 조회
 */

public interface GalleryRepository extends JpaRepository<GalleryEntity, Long> {

    /**
     * 🔍 사용자 ID로 이미지 리스트 조회
     * - userId에 해당하는 모든 GalleryEntity를 diaryDate(일기 날짜) 내림차순 정렬하여 반환
     * - 최신 이미지부터 보여주기 용도
     *
     * @param userId 사용자의 고유 ID
     * @return 이미지 목록 (List<GalleryEntity>)
     */
    List<GalleryEntity> findByUserUserIdOrderByDiaryDiaryDateDesc(Integer userId);

    /**
     * 🔍 일기 ID로 단일 이미지 조회
     * - 특정 diaryId에 연결된 이미지가 있으면 Optional에 담아 반환
     * - 이미지가 없으면 Optional.empty()
     *
     * @param diaryId 조회 대상 일기의 고유 ID
     * @return Optional<GalleryEntity>
     */
    Optional<GalleryEntity> findByDiaryDiaryId(Long diaryId);

    // 추가 - dashboardCount를 위한 사용자의 전체 이미지 개수를 세는 메소드
    long countByUser(UserEntity user);
}

