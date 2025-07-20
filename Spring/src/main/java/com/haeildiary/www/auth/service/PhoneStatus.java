<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/service/PhoneStatus.java
package com.haeildiary.www.auth.service;
========
package com.haeildairy.www.auth.service;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/service/PhoneStatus.java

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
