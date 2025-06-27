package com.heaildairy.www.auth.dto;

import lombok.Data; // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor 등을 포함

import java.time.LocalDateTime;

@Data
public class RegisterRequestDto {
    private String email;
    private String password;
    private String nickname;
    private String profileImage;

    // 필요하다면 유효성 검사 어노테이션 추가 가능;
    // @NotBlank(message = "아이디는 필수입니다.")
    // @Size(min = 4, max = 20, message = "아이디는 4~20자여야 합니다.")
};