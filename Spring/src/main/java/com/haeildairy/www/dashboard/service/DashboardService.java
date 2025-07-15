package com.haeildairy.www.dashboard.service;

import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.auth.repository.UserRepository;
import com.haeildairy.www.dashboard.dto.DashboardStatsResponseDto;
import com.haeildairy.www.diary.repository.DiaryRepository;
import com.haeildairy.www.gallery.repository.GalleryRepository;
import com.haeildairy.www.journal.repository.JournalRepository;
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
