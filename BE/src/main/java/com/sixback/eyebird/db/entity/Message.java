package com.sixback.eyebird.db.entity;

import com.sixback.eyebird.api.dto.MessageResDto;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor // 필요함
public class Message extends BaseTime {
    @Id
    @GeneratedValue
    private Long msgId;
    private int msgType; // 메세지의 타입: 0은 친구 추가, 1은 쪽지
    private String msgText; // 메세지의 내용
    private boolean ifRead; // 메세지가 읽혔는 지

    @ManyToOne
    @JoinColumn(name="user_from_id")
    private User userFrom;

    @ManyToOne
    @JoinColumn(name = "user_to_id")
    private User userTo;

    @Builder
    public Message(Long msgId, int msgType, String msgText, boolean ifRead, User userFrom, User userTo) {
        this.msgType = msgType;
        this.msgText = msgText;
        this.ifRead = ifRead;
        this.userFrom = userFrom;
        this.userTo = userTo;
    }

    public void readMessage() {
        this.ifRead = true;
    }

    public MessageResDto toMessageResDto() {
        return MessageResDto.builder()
                .msgType(this.msgType)
                .msgText(this.msgText)
                .ifRead(this.ifRead)
                .userFromNickname(userFrom.getNickname())
                .build();
    }
}