package com.haeildiary.www.auth.dto;

import lombok.Data;

@Data
public class ChangePWRequestDto {
    private String currentPassword;
    private String newPassword;
}

