<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/service/EmailStatus.java
package com.haeildiary.www.auth.service;
========
package com.haeildairy.www.auth.service;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/service/EmailStatus.java

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
