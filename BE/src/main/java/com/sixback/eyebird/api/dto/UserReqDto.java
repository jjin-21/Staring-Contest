package com.sixback.eyebird.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserReqDto {
    String email;
    String nickname;
    int profileImg;
    int classicPt;
    int itemPt;
    int win;
    int lose;

    @Override
    public String toString() {
        return "UserReqDto{" +
                "email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +
                ", profileImg=" + profileImg +
                ", classicPt=" + classicPt +
                ", itemPt=" + itemPt +
                ", win=" + win +
                ", lose=" + lose +
                '}';
    }
}
