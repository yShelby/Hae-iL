package com.haeildiary.www.selfdiagnosis.controller;

import com.haeildiary.www.auth.user.CustomUser;
import com.haeildiary.www.selfdiagnosis.dto.SelfDiagnosisDto;
import com.haeildiary.www.selfdiagnosis.service.SelfDiagnosisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@RestController
@RequestMapping("/api/self-diagnosis")
@RequiredArgsConstructor
public class SelfDiagnosisController {

    public final SelfDiagnosisService selfDiagnosisService;

    // 자가진단검사 조회 및 재검사 가능한지 확인
    @GetMapping("/status")
    public SelfDiagnosisDto.AllStatusResponse getStatus(
            @AuthenticationPrincipal CustomUser customUser, // 로그인 했을 때 자동으로 받아오는 user 정보
            @RequestParam int year,
            @RequestParam int month
    ){

        Integer userId = customUser.getUserId();

        log.info("자가진단 상태 조회:{}-{}", year, month);

        SelfDiagnosisDto.AllStatusResponse result = selfDiagnosisService.getDiagnosisStatus(userId, year, month);

        log.info("서버에서 보내는 응답 데이터: {}", result);

        return result;

    }

//    @GetMapping("/status/test")  // 새로운 테스트 엔드포인트
//    public SelfDiagnosisDto.AllStatusResponse getStatusTest() {
//        log.info("테스트 엔드포인트 진입!");
//
//        // 더미 데이터 바로 리턴
//        SelfDiagnosisDto.AllStatusResponse dummyResponse = SelfDiagnosisDto.AllStatusResponse.builder()
//                .depression(SelfDiagnosisDto.StatusResponse.builder()
//                        .available(true)
//                        .build())
//                .anxiety(SelfDiagnosisDto.StatusResponse.builder()
//                        .available(false)
//                        .percentage(80)
//                        .result("경도 불안")
//                        .nextAvailableDate(LocalDate.of(2025, 8, 25))
//                        .build())
//                .stress(SelfDiagnosisDto.StatusResponse.builder()
//                        .available(true)
//                        .build())
//                .build();
//
//        log.info("테스트 더미 응답: {}", dummyResponse);
//        return dummyResponse;
//    }

    // 자가진단 결과 제출
    @PostMapping("/{type}")
    public SelfDiagnosisDto.StatusResponse saveDiagnosisResult(
            @AuthenticationPrincipal CustomUser customUser, // 로그인 했을 때 자동으로 받아오는 user 정보
            @PathVariable String type,
            @Valid @RequestBody SelfDiagnosisDto.SubmitRequest submitRequest
            ){
        Integer userId = customUser.getUserId(); // 유저 ID
        Integer totalScore = submitRequest.getTotalScore(); // Request로 응답받은 결과 점수

        log.info("type : {} totalScore : {}", type, totalScore);

        // Service 하나로 통합 호출

        return selfDiagnosisService.saveDiagnosisResult(userId, type, totalScore);
    }
}

