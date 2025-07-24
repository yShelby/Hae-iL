package com.haeildiary.www.charts.controller;

import com.haeildiary.www.charts.dto.ChartDataResponseDto;
import com.haeildiary.www.charts.dto.ChartDatesRequestDto;
import com.haeildiary.www.charts.service.ChartsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class ChartsController {

    @Autowired
    private ChartsService chartsService;

//    @PostMapping("/charts")
//    public RequestEntity<ChartDataResponseDto> getChartData(@RequestBody ChartDatesRequestDto chartDatesRequestDto){
//
//        ChartDataResponseDto response = new ChartDataResponseDto(
//                moodScores,
//                sleepTime,
//                exerciseDuration,
//                lastDiagnosisResults,
//                currentDiagnosisResults
//        );
//
//        return ResponseEntity.ok(response);
//    }

}
