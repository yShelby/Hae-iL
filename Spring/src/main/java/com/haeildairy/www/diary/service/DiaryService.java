package com.haeildairy.www.diary.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.auth.repository.UserRepository;
import com.haeildairy.www.diary.dto.DiaryDto;
import com.haeildairy.www.diary.entity.DiaryEntity;
import com.haeildairy.www.diary.repository.DiaryRepository;
import com.haeildairy.www.mood.dto.FlaskResponseDTO;
import com.haeildairy.www.mood.service.AllService;
import com.haeildairy.www.mood.service.FlaskService;
import com.haeildairy.www.gallery.entity.GalleryEntity;
import com.haeildairy.www.gallery.repository.GalleryRepository;
import com.haeildairy.www.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * 📒 DiaryService.java
 * ──────────────────────────────
 * ✅ 역할:
 * - Diary 관련 비즈니스 로직 담당 서비스 클래스
 * - 일기 저장/수정/삭제, 조회, 이미지 처리, 활성 날짜 조회 등을 수행
 *
 * 📊 데이터 흐름도
 * 1️⃣ 클라이언트 -> 컨트롤러 -> 서비스 메서드 호출
 * 2️⃣ 서비스는 UserRepository, DiaryRepository, GalleryRepository, S3Service, ObjectMapper 등 의존 객체 활용
 * 3️⃣ DB 조회 및 조작 → S3 이미지 파일 관리 → JSON 파싱 및 이미지 URL 추출 → 응답 DTO 생성 및 반환
 */

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final GalleryRepository galleryRepository;
    private final ObjectMapper objectMapper;
    private final S3Service s3Service;
    private final FlaskService flaskService;
    private final AllService allService;

    /**
     * 📝 일기 저장
     * 1️⃣ userId로 사용자 조회, 없으면 예외 발생
     * 2️⃣ 해당 날짜 일기 존재 여부 확인 후 중복 예외 처리
     * 3️⃣ 일기 엔티티 생성 및 저장
     * 4️⃣ 일기 내용에서 이미지 추출 및 저장 처리
     * 5️⃣ 저장된 일기를 DTO로 변환하여 반환
     */
    @Transactional
    public DiaryDto.Response saveDiary(Integer userId, DiaryDto.SaveRequest dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자 아이디를 찾을 수 없습니다." + userId));

        diaryRepository.findByUserUserIdAndDiaryDate(userId, dto.getDiaryDate()).ifPresent(d -> {
            throw new IllegalStateException("해당 날짜에 이미 일기가 존재합니다: " + dto.getDiaryDate());
        });

        DiaryEntity diary = DiaryEntity.builder()
                .user(user)
                .title(dto.getTitle())
                .content(dto.getContent())
                .weather(dto.getWeather())
                .diaryDate(dto.getDiaryDate())
                .build();

        DiaryEntity savedDiary = diaryRepository.save(diary);

        extractAndSaveImage(savedDiary);

        try {
            // 감정분석요청(Flask 서버 호출)
            FlaskResponseDTO analysis = flaskService.callAnalyze(savedDiary.getContent());
            // 감정 분석 결과 저장
            allService.allEmotion(analysis, savedDiary);
            log.info("감정 분석 성공: {}", analysis);
        } catch (Exception e) {
            log.error("감정 분석 실패: {}", e.getMessage());
        }

        return DiaryDto.Response.fromEntity(savedDiary);
    }

    /**
     * ✏️ 일기 수정
     * 1️⃣ diaryId로 일기 조회, 없으면 예외 발생
     * 2️⃣ 해당 일기 소유자(userId) 확인, 권한 없으면 예외 발생
     * 3️⃣ 제목, 내용, 날씨 수정
     * 4️⃣ 이미지 변경 반영을 위해 이미지 처리 메서드 호출
     * 5️⃣ 수정된 일기를 DTO로 변환하여 반환
     */
    @Transactional
    public DiaryDto.Response updateDiary(Long diaryId, Integer userId, DiaryDto.UpdateRequest dto) {
        DiaryEntity diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new NoSuchElementException("해당 일기를 찾을 수 없습니다: " + diaryId));

        if (!diary.getUser().getUserId().equals(userId)) {
            throw new SecurityException("사용자가 이 일기를 수정할 권한이 없습니다.");
        }

        diary.setTitle(dto.getTitle());
        diary.setContent(dto.getContent());
        diary.setWeather(dto.getWeather());

        extractAndSaveImage(diary);
        try {
            // 감정 분석 요청 (Flask 서버 호출)
            FlaskResponseDTO analysis = flaskService.callAnalyze(diary.getContent());

            // 감정 분석 결과 저장
            allService.allEmotion(analysis, diary);

            log.info("감정 분석 성공: {}", analysis);
        } catch (Exception e) {
            log.error("감정 분석 실패: {}", e.getMessage());
        }
        return DiaryDto.Response.fromEntity(diary);
    }

    /**
     * 🗑️ 일기 삭제
     * 1️⃣ diaryId로 일기 조회, 없으면 예외 발생
     * 2️⃣ 권한 확인 (userId와 일기 소유자 비교)
     * 3️⃣ 갤러리에서 연관 이미지 조회
     * 4️⃣ S3에 저장된 이미지 파일 삭제
     * 5️⃣ 갤러리 DB 레코드 삭제
     * 6️⃣ 일기 DB 레코드 삭제
     */
    @Transactional
    public void deleteDiary(Long diaryId, Integer userId) {
        DiaryEntity diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new NoSuchElementException("해당 일기를 찾을 수 없습니다: " + diaryId));

        if (!diary.getUser().getUserId().equals(userId)) {
            throw new SecurityException("사용자가 이 일기를 삭제할 권한이 없습니다.");
        }

        Optional<GalleryEntity> imageOpt = galleryRepository.findByDiaryDiaryId(diaryId);

        if (imageOpt.isPresent()) {
            GalleryEntity image = imageOpt.get();
            s3Service.deleteFile(image.getFileKey());
            galleryRepository.delete(image);
        }

        diaryRepository.delete(diary);
    }

    /**
     * 🔎 일기 상세 조회 (ID 기준)
     * 1️⃣ diaryId로 일기 조회, 없으면 예외 발생
     * 2️⃣ 권한 확인 (userId와 일기 소유자 비교)
     * 3️⃣ DTO 변환 후 반환
     */
    public DiaryDto.Response findDiaryById(Long diaryId, Integer userId) {
        DiaryEntity diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new NoSuchElementException("해당 일기를 찾을 수 없습니다: " + diaryId));

        if (!diary.getUser().getUserId().equals(userId)) {
            throw new SecurityException("사용자가 이 일기를 조회할 권한이 없습니다.");
        }

        return DiaryDto.Response.fromEntity(diary);
    }

    /**
     * 🔎 일기 상세 조회 (날짜 기준)
     * 1️⃣ userId와 날짜 기준으로 일기 조회
     * 2️⃣ 있으면 DTO 변환, 없으면 null 반환
     */
    public DiaryDto.Response findDiaryByDate(Integer userId, LocalDate date) {
        return diaryRepository.findByUserUserIdAndDiaryDate(userId, date)
                .map(DiaryDto.Response::fromEntity)
                .orElse(null);
    }

    /**
     * 📅 활성 일자 리스트 조회
     * 1️⃣ 특정 userId와 year, month 기준으로 작성된 일기 날짜 목록 조회
     */
    public List<LocalDate> findActiveDates(Integer userId, int year, int month) {
        return diaryRepository.findActiveDatesByUserIdAndYearMonth(userId, year, month);
    }

    /**
     * 🖼️ 이미지 추출 및 저장/삭제 처리
     * 1️⃣ 일기 본문(content)을 JSON으로 파싱
     * 2️⃣ TipTap 포맷에서 이미지 노드 탐색
     * 3️⃣ 이미지가 존재하면 URL에서 S3 파일키 추출
     * 4️⃣ 기존 갤러리 이미지가 있으면 업데이트, 없으면 새로 저장
     * 5️⃣ 이미지 URL 변경 시 기존 S3 파일 삭제
     * 6️⃣ 이미지가 없으면 기존 이미지 및 S3 파일 삭제
     * 7️⃣ JSON 파싱 실패 시 에러 로그 기록
     */
    private void extractAndSaveImage(DiaryEntity diary) {
        try {
            JsonNode rootNode = objectMapper.readTree(diary.getContent());
            JsonNode imageNode = findImageNode(rootNode);
            Optional<GalleryEntity> existingImageOpt = galleryRepository.findByDiaryDiaryId(diary.getDiaryId());

            if (imageNode != null) {
                String imageUrl = imageNode.get("attrs").get("src").asText();
                String fileKey = extractFileKeyFromUrl(imageUrl);

                if (fileKey == null) {
                    log.warn("이미지 URL에서 파일 키를 추출할 수 없습니다: {}", imageUrl);
                    existingImageOpt.ifPresent(image -> {
                        s3Service.deleteFile(image.getFileKey());
                        galleryRepository.delete(image);
                    });
                    return;
                }

                GalleryEntity image = existingImageOpt.orElseGet(() -> GalleryEntity.builder()
                        .user(diary.getUser())
                        .diary(diary)
                        .build());

                if (existingImageOpt.isPresent() && !existingImageOpt.get().getFileKey().equals(fileKey)) {
                    s3Service.deleteFile(existingImageOpt.get().getFileKey());
                }

                image.setFileKey(fileKey);
                galleryRepository.save(image);

            } else {
                existingImageOpt.ifPresent(image -> {
                    s3Service.deleteFile(image.getFileKey());
                    galleryRepository.delete(image);
                });
            }
        } catch (JsonProcessingException e) {
            log.error("일기 내용 JSON 파싱 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 🔍 재귀적으로 TipTap JSON 트리에서 이미지 타입 노드 탐색
     */
    private JsonNode findImageNode(JsonNode node) {
        if (node.has("type") && "image".equals(node.get("type").asText())) {
            return node;
        }
        if (node.has("content") && node.get("content").isArray()) {
            for (JsonNode child : node.get("content")) {
                JsonNode found = findImageNode(child);
                if (found != null) return found;
            }
        }
        return null;
    }

    /**
     * 🔑 S3 URL에서 파일 키만 추출 (amazonaws.com 이후 부분)
     */
    private String extractFileKeyFromUrl(String url) {
        if (url == null || !url.contains(".amazonaws.com/")) {
            return null;
        }
        return url.substring(url.indexOf(".amazonaws.com/") + 15);
    }
}
