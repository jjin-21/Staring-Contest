package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class MatchingReqDto {
    // 아이템 전인지 여부
    boolean ifItem;

    // 매칭 요청한 유저의 이메일
    @NotBlank(message="매칭 요청: 매칭 요청한 유저의 이메일은 빈 문자열이 되어선 안 됩니다")
    String email;

    // 유저의 현재 점수
    int point;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        MatchingReqDto matchingReqDto = (MatchingReqDto) obj;
        return ifItem == matchingReqDto.isIfItem() && this.email.equals(matchingReqDto.email) && this.point == matchingReqDto.point;
    }

}
