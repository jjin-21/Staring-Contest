package com.sixback.eyebird.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BlackListDto {
    private String roomName;
    private String email;

    @Override
    public String toString() {
        return "BlackListDto{" +
                "roomId='" + roomName + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
