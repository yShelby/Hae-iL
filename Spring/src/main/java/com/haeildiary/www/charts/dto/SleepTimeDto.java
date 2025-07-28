package com.haeildiary.www.charts.dto;

import java.time.LocalTime;

public record SleepTimeDto (LocalTime bedtime, LocalTime waketime){
}
