package com.sixback.eyebird.api.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CheckPasswordReqDto {
    private String password;

    @Builder
    public CheckPasswordReqDto(String password) {
        this.password = password;
    }
}
