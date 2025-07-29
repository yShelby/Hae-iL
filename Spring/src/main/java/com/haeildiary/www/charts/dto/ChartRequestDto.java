package com.haeildiary.www.charts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartRequestDto {
    private String mode;     // "weekly" 또는 "monthly"
    private String endDate;  // "2025-07-27" 형식
}