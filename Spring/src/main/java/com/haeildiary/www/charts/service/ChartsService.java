package com.haeildiary.www.charts.service;

import com.haeildiary.www.charts.dto.ChartDataResponseDto;
import com.haeildiary.www.charts.dto.ChartDatesRequestDto;
import org.springframework.stereotype.Service;

@Service
public class ChartsService {

    public ChartDataResponseDto getChartData(ChartDatesRequestDto requestDto) {
        // 1. DB 데이터 조회
        // 2. 조회 결과 정제 및 가공
        // 3. 응답 DTO에 담아 리턴

        return new ChartDataResponseDto(
                null, // moodScores
                null, // sleepTime
                null, // exerciseDuration
                null,    // lastDiagnosisResults
                null     // currentDiagnosisResults
        );
    }
}
