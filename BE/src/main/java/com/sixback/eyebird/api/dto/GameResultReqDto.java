package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameResultReqDto {
    private boolean isItem;
    @NotBlank(message="랭크 게임의 승자의 닉네임은 빈 문자열일 수 없습니다")
    private String userWinnerNickname;
    @NotBlank(message="랭크 게임의 패자의 닉네임은 빈 문자열일 수 없습니다")
    private String userLoserNickname;
}
