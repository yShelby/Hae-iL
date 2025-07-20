<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/event/LogoutEvent.java
package com.haeildiary.www.auth.event;
========
package com.haeildairy.www.auth.event;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/event/LogoutEvent.java

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
