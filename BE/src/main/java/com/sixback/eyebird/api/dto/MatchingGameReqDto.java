package com.sixback.eyebird.api.dto;

import lombok.Getter;

@Getter
public class MatchingGameReqDto {
    // 매칭이 성공된 후의 openvidu
    private String gameId;
}
