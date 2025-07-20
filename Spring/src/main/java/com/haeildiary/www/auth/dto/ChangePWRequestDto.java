<<<<<<<< HEAD:Spring/src/main/java/com/haeildiary/www/auth/dto/ChangePWRequestDto.java
package com.haeildiary.www.auth.dto;
========
package com.haeildairy.www.auth.dto;
>>>>>>>> 6bc13512348a3a61e256c68c020ee317d3a728a3:Spring/src/main/java/com/haeildairy/www/auth/dto/ChangePWRequestDto.java

import lombok.Data;

@Data
public class ChangePWRequestDto {
    private String currentPassword;
    private String newPassword;
}

