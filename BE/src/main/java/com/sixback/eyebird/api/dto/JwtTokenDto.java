package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JwtTokenDto {

    private String grantType; // 인증의 header. Bearer를 이용할 것
    @NotBlank
    private String accessToken;
    @NotBlank
    private String refreshToken;

    @Builder
    public JwtTokenDto(String grantType, String accessToken, String refreshToken) {
        this.grantType = grantType;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
