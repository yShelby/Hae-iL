package com.heaildairy.www.auth.service;

public enum PhoneStatus {
    AVAILABLE("사용 가능한 전화번호입니다."),
    ACTIVE_DUPLICATE("이미 사용 중인 전화번호입니다."),
    INACTIVE_DUPLICATE("탈퇴한 회원의 전화번호입니다.");

    private final String message;

    PhoneStatus(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
