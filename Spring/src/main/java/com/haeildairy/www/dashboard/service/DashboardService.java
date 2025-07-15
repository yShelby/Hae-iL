package com.heaildairy.www.dashboard.service;

import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.auth.repository.UserRepository;
import com.heaildairy.www.dashboard.dto.DashboardStatsResponseDto;
import com.heaildairy.www.diary.repository.DiaryRepository;
import com.heaildairy.www.gallery.repository.GalleryRepository;
import com.heaildairy.www.journal.repository.JournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;
    private final JournalRepository journalRepository;
    private final GalleryRepository galleryRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponseDto getDashboardStats(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId));

        long totalDiaryCount = diaryRepository.countByUser(user);
        long journalingCount = journalRepository.countByUser(user);
        long galleryImageCount = galleryRepository.countByUser(user);

        return new DashboardStatsResponseDto(totalDiaryCount, journalingCount, galleryImageCount);
    }
}
