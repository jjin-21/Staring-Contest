package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MessageResDto {
    private Long msgId;
    private int msgType; // 친구 초대 메세지: 0, 쪽지: 1
    private String msgText;
    private boolean ifRead;

    @NotBlank(message = "메세지의 발신자는 빈 문자열이 아닙니다")
    private String userFromNickname; // 발신자의 닉네임
}
