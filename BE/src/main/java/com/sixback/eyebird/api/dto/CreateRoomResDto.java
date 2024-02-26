package com.sixback.eyebird.api.dto;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateRoomResDto {
    private String sessionId;
}
