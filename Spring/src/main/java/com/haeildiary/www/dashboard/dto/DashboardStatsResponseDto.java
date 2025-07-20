<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/dashboard/dto/DashboardStatsResponseDto.java
package com.haeildiary.www.dashboard.dto;
========
package com.haeildairy.www.dashboard.dto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/dashboard/dto/DashboardStatsResponseDto.java

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
