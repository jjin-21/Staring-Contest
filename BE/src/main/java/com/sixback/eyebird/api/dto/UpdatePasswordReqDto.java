package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UpdatePasswordReqDto {
    @NotBlank
    private String currentPassword;
    @NotBlank
    private String newPassword;
}
