package com.haeildiary.www.dashboard.count.service;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.dashboard.count.dto.CountStatsResponseDto;
import com.haeildiary.www.diary.repository.DiaryRepository;
import com.haeildiary.www.gallery.repository.GalleryRepository;
import com.haeildiary.www.journal.repository.JournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CountService {

    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;
    private final JournalRepository journalRepository;
    private final GalleryRepository galleryRepository;

    @Transactional(readOnly = true)
    public CountStatsResponseDto getDashboardStats(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. ID: " + userId));

        long totalDiaryCount = diaryRepository.countByUser(user);
        long journalingCount = journalRepository.countByUser(user);
        long galleryImageCount = galleryRepository.countByUser(user);

        return new CountStatsResponseDto(totalDiaryCount, journalingCount, galleryImageCount);
    }
}
