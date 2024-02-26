package com.sixback.eyebird.api.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
public class RoomDto {
    private String roomId;          // 방의 고유 식별자 room_ + roomId 형식으로 key 제작
    private String roomName;        // 방의 제목
    private boolean item;           // 아이템전 여부
    // Rombok에서 isItem Getter를 만들기 때문에 Redis에 item으로 저장되는 버그가 있어서 Dto를 item으로 변경함.
    private boolean hasPassword;    // 비밀번호방 여부
    private boolean status;         // 대기중, 게임중의 두 가지 상태

    private int maxCapacity;        // 최대 인원수
    private int currentCapacity;    // 현재 인원수

    private int password;           // 방 접근을 위한 비밀번호 (선택적)
    private long ownerId;           // 방장 ID

    public void addCapacity(){
        currentCapacity += 1;
    }
    public void reduceCapacity(){
        currentCapacity -= 1;
    }

    public void setRoomId(String roomId) {this.roomId = roomId;}

    public void setPassword(int newPassword){
        this.password = newPassword;
    }
    public void setHasPassword(boolean has){
        this.hasPassword = has;
    }
    public void setStatus(boolean status) {
        this.status = status;
    }
}

