package com.haeildiary.www.selfdiagnosis.common;

import java.time.LocalDate;

// 공통 인터페이스 (조회 전용 Read-only) : 불안, 우울, 스트레스를 조회하기 위한 기본 인터페이스
public interface CommonStatusAccessor {
    Boolean getAvailable();
    Integer getPercentage();
    String getResult();
    LocalDate getNextAvailableDate();
}
