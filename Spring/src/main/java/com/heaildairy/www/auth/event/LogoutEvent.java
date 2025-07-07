package com.heaildairy.www.auth.event;

import org.springframework.context.ApplicationEvent;

public class LogoutEvent extends ApplicationEvent {
    private final String userEmail;

    public LogoutEvent(Object source, String userEmail) {
        super(source);
        this.userEmail = userEmail;
    }

    public String getUserEmail() {
        return userEmail;
    }
}
