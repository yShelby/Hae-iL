package com.haeildiary.www.charts.controller;

import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.charts.dto.AllChartDataResponseDto;
import com.haeildiary.www.charts.dto.ChartRequestDto;
import com.haeildiary.www.charts.service.ChartsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/charts")
public class ChartsController {

    @Autowired
    private ChartsService chartsService;

    @PostMapping
    public AllChartDataResponseDto getChartData(
            @AuthenticationPrincipal CustomUser customUser, // 로그인 했을 때 자동으로 받아오는 user 정보
            @RequestBody ChartRequestDto request) {

        Integer userId = customUser.getUserId();

        log.info("차트 데이터 요청: {}", request);

        AllChartDataResponseDto chartData = chartsService.getAllChartData(userId, request);

        log.info("차트 데이터 전송: {}", chartData);
        return chartData;
    }
}


