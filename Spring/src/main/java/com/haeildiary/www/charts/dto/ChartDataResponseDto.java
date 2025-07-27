package com.haeildiary.www.charts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataResponseDto {
    private List<Integer> moodScores;
    private List<Integer> sleepTime;
    private List<Integer> exerciseDuration;
    private List<Integer> lastTotalScores;
    private List<Integer> currentTotalScores;
}
