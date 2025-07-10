package com.heaildairy.www.auth.service;

public enum EmailStatus {
    AVAILABLE("사용 가능한 이메일입니다."),
    ACTIVE_DUPLICATE("이미 사용 중인 이메일입니다."),
    INACTIVE_DUPLICATE("탈퇴한 회원의 이메일입니다.");

    private final String message;

    EmailStatus(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
