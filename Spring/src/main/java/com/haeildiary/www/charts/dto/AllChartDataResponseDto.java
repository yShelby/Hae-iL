package com.haeildiary.www.charts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllChartDataResponseDto {

    private List<MoodScore> moodScores;
    private List<SleepTime> sleepTime;
    private List<ExerciseDuration> exerciseDuration;
    private MonthlyResult lastMonthResults;
    private MonthlyResult thisMonthResults;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MoodScore {
        private LocalDate diaryDate;
        private Integer moodScore;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SleepTime {
        private LocalDate sleepDate;
        private Integer bedtime;
        private Integer waketime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExerciseDuration {
        private LocalDate exerciseDate;
        private Integer duration;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyResult {
        private Integer year;
        private Integer month;
        private Integer anxiety;
        private Integer depression;
        private Integer stress;
    }
}

// 받는 데이터 형식
//{
//        "moodScores": [
//        { "diaryDate": "2025-07-21", "moodScore": -50 },
//        { "diaryDate": "2025-07-22", "moodScore": 20 },
//        { "diaryDate": "2025-07-23", "moodScore": 80 },
//        { "diaryDate": "2025-07-24", "moodScore": -30 },
//        { "diaryDate": "2025-07-25", "moodScore": 60 },
//        { "diaryDate": "2025-07-26", "moodScore": 10 },
//        { "diaryDate": "2025-07-27", "moodScore": 40 }
//        ],
//        "sleepTime": [
//        { "sleepDate": "2025-07-21", "bedtime": 1500, "waketime": 1950 },
//        { "sleepDate": "2025-07-22", "bedtime": 1290, "waketime": 1910 },
//        { "sleepDate": "2025-07-23", "bedtime": 1515, "waketime": 1980 },
//        { "sleepDate": "2025-07-24", "bedtime": 1380, "waketime": 1920 },
//        { "sleepDate": "2025-07-25", "bedtime": 1545, "waketime": 1995 },
//        { "sleepDate": "2025-07-26", "bedtime": 1070, "waketime": 1410 },
//        { "sleepDate": "2025-07-27", "bedtime": 1520, "waketime": 1930 },
//        ],
//        "exerciseDuration": [
//        { "exerciseDate": "2025-07-21", "duration": 30 },
//        { "exerciseDate": "2025-07-22", "duration": 45 },
//        { "exerciseDate": "2025-07-23", "duration": 0 },
//        { "exerciseDate": "2025-07-24", "duration": 60 },
//        { "exerciseDate": "2025-07-25", "duration": 20 },
//        { "exerciseDate": "2025-07-26", "duration": 90 },
//        { "exerciseDate": "2025-07-27", "duration": 15 }
//        ],
//        "lastMonthResults": {
//        "year": 2025,
//        "month": 6,
//        "anxiety": 15,
//        "depression": 12,
//        "stress": 18
//        },
//        "thisMonthResults": {
//        "year": 2025,
//        "month": 7,
//        "anxiety": 9,
//        "depression": 7,
//        "stress": 26
//        }
//        }