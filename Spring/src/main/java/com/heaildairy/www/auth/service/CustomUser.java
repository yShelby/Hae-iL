package com.heaildairy.www.auth.service; // CustomUser가 service 패키지에 있다고 가정

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDateTime;
import java.util.Collection;

@Getter
@Setter
@ToString(callSuper = true)
public class CustomUser extends User {
    private String userId;
    private String nickname;
    private String profileImage;
    private Integer themeId;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;

    public CustomUser(
            String email,
            String password,
            Collection<? extends GrantedAuthority> authorities) {
        super(email, password, authorities);
    };
    public CustomUser(
            String email, String password, Collection<? extends GrantedAuthority> authorities,
                      String userId, String nickname, String profileImage,
                      Integer themeId, LocalDateTime lastLoginAt, LocalDateTime createdAt
    ) {
        super(email, password, authorities);
    };

}

