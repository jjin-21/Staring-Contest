package com.sixback.eyebird.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class RequestRoomDto {
    @NotBlank(message = "방의 제목은 empty string이 되어선 안 됩니다")
    private String roomName;        // 방의 제목
    private boolean isItem;         // 아이템전 여부
    private int maxCapacity;        // 최대 인원수
    private int password;           // 방 접근을 위한 비밀번호 (선택적)

    public RequestRoomDto(String roomName, boolean isItem, int maxCapacity, int password) {
        this.roomName = roomName;
        this.isItem = isItem;
        this.maxCapacity = maxCapacity;
        this.password = password;
    }


    @Override
    public String toString() {
        return "RequestRoomDto{" +
                "roomName='" + roomName + '\'' +
                ", isItem=" + isItem +
                ", maxCapacity=" + maxCapacity +
                ", password=" + password +
                '}';
    }

}
