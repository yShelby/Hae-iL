package com.heaildairy.www.auth.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record AuthDTO(
        // valid 검사는 이중으로 하는 게 좋다고 함
        @NotBlank(message = "메뉴명은 필수입니다.")
        String menu,
        @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
        int count
){
}
