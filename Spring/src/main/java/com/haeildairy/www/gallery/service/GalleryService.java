package com.haeildairy.www.gallery.service;

import com.haeildairy.www.gallery.dto.GalleryDto;
import com.haeildairy.www.gallery.repository.GalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 🎨 GalleryService.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 사용자별 이미지 갤러리 조회 서비스 레이어
 * - DB에서 이미지 목록을 가져와 DTO로 변환 후 반환
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트가 사용자 ID로 이미지 목록 요청
 * 2️⃣ GalleryRepository를 통해 DB에서 이미지 엔티티 리스트 조회 (최신순 정렬)
 * 3️⃣ 조회한 엔티티들을 GalleryDto로 변환
 * 4️⃣ 변환된 DTO 리스트를 클라이언트에 반환
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 조회 전용 트랜잭션 적용
public class GalleryService {

    private final GalleryRepository imageRepository; // 이미지 DB 접근 객체

    /**
     * 📥 사용자 ID로 이미지 목록 조회 및 DTO 변환 반환
     *
     * @param userId 이미지 소유자 사용자 ID
     * @return 사용자의 이미지 DTO 리스트 (최신 날짜 순)
     */
    public List<GalleryDto> getGalleryImages(Integer userId) {
        return imageRepository.findByUserUserIdOrderByDiaryDiaryDateDesc(userId) // 2️⃣ DB에서 사용자 이미지 최신순 조회
                .stream()
                .map(GalleryDto::fromEntity) // 3️⃣ 엔티티 -> DTO 변환
                .collect(Collectors.toList()); // 4️⃣ 리스트로 수집하여 반환
    }
}
