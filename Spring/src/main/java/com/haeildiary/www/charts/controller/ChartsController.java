package com.haeildiary.www.charts.controller;

import com.haeildiary.www.charts.service.ChartsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/charts")
public class ChartsController {

    @Autowired
    private ChartsService chartsService;

    @PostMapping
    public String getChartData(@RequestBody String request) {
        log.info("차트 데이터 요청: {}", request);

        // 더미 JSON 데이터 (프론트 response.data에 맞춤)
        return """
        {
            "moodScores": [-50, 20, 80, -30, 60, 10, 40],
            "sleepTime": [
                ["01:00", "08:30"],
                ["21:30", "07:50"],
                ["01:15", "09:00"]
            ],
            "exerciseDuration": [30, 45, 0, 60, 20, 90, 15],
            "lastMonthResults": [15, 12, 18],
            "thisMonthResults": [9, 7, 26]
        }
        """;
    }
}