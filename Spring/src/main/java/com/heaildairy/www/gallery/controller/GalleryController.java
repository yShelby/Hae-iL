package com.heaildairy.www.gallery.controller;

import com.heaildairy.www.auth.user.CustomUser;
import com.heaildairy.www.gallery.dto.GalleryDto;
import com.heaildairy.www.gallery.service.GalleryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 🎨 GalleryController.java
 * ──────────────────────────────
 * ✅ 역할:
 * - 사용자 갤러리 이미지 조회용 REST API 컨트롤러
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트 요청 → /api/gallery GET 요청 발생
 * 2️⃣ 인증된 사용자 정보(CustomUser) 주입
 * 3️⃣ GalleryService의 getGalleryImages(userId) 호출하여 이미지 리스트 조회
 * 4️⃣ 조회된 이미지 리스트를 HTTP 200 OK 응답으로 반환
 */

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    /**
     * 📥 사용자 갤러리 이미지 목록 조회 API
     * - 인증된 사용자(CustomUser)로부터 userId 추출
     * - 서비스에서 해당 userId의 이미지 리스트 조회
     * - 조회 결과를 ResponseEntity로 감싸 클라이언트에 반환
     */
    @GetMapping
    public ResponseEntity<List<GalleryDto>> getGalleryImages(@AuthenticationPrincipal CustomUser customUser) {
        List<GalleryDto> images = galleryService.getGalleryImages(customUser.getUserId());
        return ResponseEntity.ok(images);
    }
}
