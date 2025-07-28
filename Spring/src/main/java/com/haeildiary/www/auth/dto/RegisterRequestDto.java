package com.haeildiary.www.auth.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

import java.util.List;

@Data
public class RegisterRequestDto {

    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 주소 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상, 20자 이하여야 합니다.")
    // 정규식: 영문 대/소문자, 숫자, 특수문자를 포함 (클라이언트와 동일하게)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
            message = "비밀번호는 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.")
    private String password;

    @NotBlank(message = "이름은 필수 입력 항목입니다.")
    private String name;

    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    private String phone;

    // 서비스에서 암호화해서 저장할 필드 (폼에서 받지 않음)
    private String encryptedPhoneNumber;

    @NotBlank(message = "닉네임은 필수 입력 항목입니다.")
    @Size(min = 2, max = 15, message = "닉네임은 2자 이상, 15자 이하여야 합니다.")
    private String nickname;

//    private String profileImage;

    //    @ValidEmotionSelection
    private List<String> initialEmotion;

    //    @ValidGenreSelection
    private List<String> initialGenre;
}