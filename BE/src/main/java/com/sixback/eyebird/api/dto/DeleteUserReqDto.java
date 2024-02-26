package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class DeleteUserReqDto {
    @NotBlank(message = "비밀번호가 입력되어야 합니다")
    private String password;
}
