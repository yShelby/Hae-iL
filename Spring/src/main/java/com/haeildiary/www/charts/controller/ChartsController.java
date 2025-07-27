package com.haeildiary.www.charts.controller;

import com.haeildiary.www.charts.service.ChartsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

    import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/charts")
public class ChartsController {

    @Autowired
    private ChartsService chartsService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> getChartData(@RequestBody String request) {
        log.info("차트 데이터 요청: {}", request);

        Map<String, Object> chartData = chartsService.getAllChartData();
        return ResponseEntity.ok(chartData);
    }
}



//{
//        "moodScores": [
//        { "assessmentDate": "2025-07-21", "score": -50 },
//        { "assessmentDate": "2025-07-22", "score": 20 },
//        { "assessmentDate": "2025-07-23", "score": 80 },
//        { "assessmentDate": "2025-07-24", "score": -30 },
//        { "assessmentDate": "2025-07-25", "score": 60 },
//        { "assessmentDate": "2025-07-26", "score": 10 },
//        { "assessmentDate": "2025-07-27", "score": 40 }
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
//        "sleepTime": [
//        { "sleepDate": "2025-07-21", "bedtime": 1500, "waketime": 1950 },
//        { "sleepDate": "2025-07-22", "bedtime": 1290, "waketime": 1910 },
//        { "sleepDate": "2025-07-23", "bedtime": 1515, "waketime": 1980 },
//        { "sleepDate": "2025-07-24", "bedtime": 1380, "waketime": 1920 },
//        { "sleepDate": "2025-07-25", "bedtime": 1545, "waketime": 1995 },
//        { "sleepDate": "2025-07-26", "bedtime": 1070, "waketime": 1410 },
//        { "sleepDate": "2025-07-27", "bedtime": 1520, "waketime": 1930 },
//        ],
//        "lastMonthResults": {
//        "yearMonth": "2025-06",
//        "anxiety": 15,
//        "depression": 12,
//        "stress": 18
//        },
//        "thisMonthResults": {
//        "yearMonth": "2025-07",
//        "anxiety": 9,
//        "depression": 7,
//        "stress": 26
//        }
//        }