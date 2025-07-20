<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/service/DashboardService.java
package com.haeildiary.www.dashboard.service;

import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.auth.repository.UserRepository;
import com.haeildiary.www.dashboard.dto.DashboardStatsResponseDto;
import com.haeildiary.www.diary.repository.DiaryRepository;
import com.haeildiary.www.gallery.repository.GalleryRepository;
import com.haeildiary.www.journal.repository.JournalRepository;
========
package com.haeildairy.www.dashboard.service;

import com.haeildairy.www.auth.entity.UserEntity;
import com.haeildairy.www.auth.repository.UserRepository;
import com.haeildairy.www.dashboard.dto.DashboardStatsResponseDto;
import com.haeildairy.www.diary.repository.DiaryRepository;
import com.haeildairy.www.gallery.repository.GalleryRepository;
import com.haeildairy.www.journal.repository.JournalRepository;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/service/DashboardService.java
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
