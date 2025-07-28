package com.haeildiary.www.charts.dto;

import lombok.Data;

import java.util.List;

@Data // Getter, Setter, toString, equal, hashcode
public class ChartDatesRequestDto {
    private int userId;
    private String mode; // "weekly" or "monthly"
    private List<String> weeklyDates;
    private List<String> monthlyDates;
    private List<String> twoMonths;
}
