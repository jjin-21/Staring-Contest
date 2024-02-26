package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class FriendAcceptReqDto {

    // 친구 요청을 수락받는 유저의 닉네임
    @NotBlank(message = "친구 요청 수락: ")
    private String userFrom;

}
