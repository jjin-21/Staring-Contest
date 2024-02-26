package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class SignupResDto {
    @NotBlank
    private String email;
}
