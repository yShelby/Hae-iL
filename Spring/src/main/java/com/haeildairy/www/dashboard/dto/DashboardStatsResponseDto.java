package com.heaildairy.www.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponseDto {
    private long totalDiaryCount;
    private long journalingCount;
    private long galleryImageCount;
}
