package com.heaildairy.www.dashboard.count.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CountStatsResponseDto {
    private long totalDiaryCount;
    private long journalingCount;
    private long galleryImageCount;
}
