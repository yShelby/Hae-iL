<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/service/EmailFindStatus.java
package com.haeildiary.www.auth.service;
========
package com.haeildairy.www.auth.service;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/service/EmailFindStatus.java

public enum EmailFindStatus {
    NOT_FOUND("해당 전화번호로 가입된 이메일이 없습니다."),
    ACTIVE_USER_FOUND("가입된 이메일을 찾았습니다."), // This message might not be directly used, but for clarity
    INACTIVE_USER_FOUND("탈퇴한 회원의 전화번호입니다.");

    private final String message;

    EmailFindStatus(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
