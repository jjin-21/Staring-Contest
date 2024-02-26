package com.sixback.eyebird.api.dto;

import lombok.Getter;

@Getter
public class MessageReqDto {
    private int msgType; // 메세지 타입
    private String msgText; // 메세지 내용

    private String userToEmail; // 메세지를 받는 사람의 이메일. 메세지를 보내는 사람의 이메일은 로그인 된 유저의 그것이다.

}
