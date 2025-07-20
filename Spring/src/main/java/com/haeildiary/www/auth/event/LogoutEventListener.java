<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/event/LogoutEventListener.java
package com.haeildiary.www.auth.event;

import com.haeildiary.www.auth.service.UserService;
========
package com.haeildairy.www.auth.event;

import com.haeildairy.www.auth.service.UserService;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/event/LogoutEventListener.java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LogoutEventListener {

    private final UserService userService;

    @EventListener
    public void handleLogoutEvent(LogoutEvent event) {
        log.debug("LogoutEventListener: Received LogoutEvent for user: {}", event.getUserEmail());
        try {
            userService.logout(event.getUserEmail());
            log.info("LogoutEventListener: Successfully processed logout for user: {}", event.getUserEmail());
        } catch (Exception e) {
            log.error("LogoutEventListener: Error processing logout for user {}: {}", event.getUserEmail(), e.getMessage(), e);
        }
    }
}
