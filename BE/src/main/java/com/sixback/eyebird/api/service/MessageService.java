package com.sixback.eyebird.api.service;

import com.sixback.eyebird.api.dto.MessageReqDto;
import com.sixback.eyebird.api.dto.MessageResDto;
import com.sixback.eyebird.db.entity.GameResult;
import com.sixback.eyebird.db.entity.Message;
import com.sixback.eyebird.db.entity.User;
import com.sixback.eyebird.db.repository.MessageRepository;
import com.sixback.eyebird.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final UserRepository userRepository;

    private final MessageRepository messageRepository;

    // 수신한 메세지 DB에 저장
    public void saveMessage(MessageReqDto messageReqDto, String userFromEmail) {
        User userFrom = userRepository.findUserByEmail(userFromEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));
        User userTo = userRepository.findUserByEmail(messageReqDto.getUserToEmail()).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));

        Message message = Message.builder()
                .msgType(messageReqDto.getMsgType())
                .msgText(messageReqDto.getMsgText())
                .ifRead(false)
                .userTo(userTo)
                .userFrom(userFrom)
                .build();

        messageRepository.save(message);
        log.info("송신된 메세지가 저장되었습니다");

    }

    // 특정한 메세지 확인
    public void readMessage(Long messageId) {
        Message message = messageRepository.findById(messageId).orElseThrow(() -> new IllegalArgumentException("메세지 확인: 확인하려고 하는 메세지가 존재하지 않습니다"));

        message.readMessage();
        log.info("메세지 확인");

    }

    // 나의 친구 요청 메세지 모두 가져오기
    public List<MessageResDto> getFriendReqMessages(String email) {
        User user = userRepository.findUserByEmail(email).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));

        // 나에게 보내진 모든 친구요청 메세지 가져오기
        Long userId = user.getId();
        List<Message> messages = messageRepository.findByUserTo_IdAndMsgTypeOrderByCreatedDate(userId, 0);

        List<MessageResDto> messageResDtoList = new ArrayList<>();

        for (Message m: messages) {
            messageResDtoList.add(m.toMessageResDto());
        }

        log.info("나의 친구 요청 메세지를 모두 가져왔습니다");
        return messageResDtoList;

    }

    // 나의 쪽지 메세지 모두 가져오기
    public List<MessageResDto> getTextMessages(String email) {
        User user = userRepository.findUserByEmail(email).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));

        // 나에게 보내진 모든 쪽지 메세지 모두 가져오기
        Long userId = user.getId();
        List<Message> messages = messageRepository.findByUserTo_IdAndMsgTypeOrderByCreatedDate(userId, 1);

        List<MessageResDto> messageResDtoList = new ArrayList<>();

        for (Message m: messages) {
            messageResDtoList.add(m.toMessageResDto());
        }

        log.info("나의 친구 요청 메세지를 모두 가져왔습니다");
        return messageResDtoList;

    }


    // 특정 메세지 삭제
    public void deleteMessage(Long id) {
        Message message = messageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 메세지를 찾을 수 없습니다"));

        messageRepository.deleteById(id);
        log.info("메세지를 삭제했습니다");
    }

    // 친구 요청을 수락
    public void acceptFriend(String userFromEmail, String userToEmail) {

        User userFrom = userRepository.findUserByEmail(userFromEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));
        User userTo = userRepository.findUserByEmail(userToEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));

        Long fromId = userFrom.getId();
        Long toId = userTo.getId();

        // 친구 요청 메세지를 찾는다
        List<Message> messages = messageRepository.findByUserFrom_IdAndUserTo_IdAndMsgType(fromId, toId, 0);
        Long messageId = messages.get(0).getMsgId();

        // 친구 요청 메세지 삭제
        deleteMessage(messageId);

        log.info("친구 요청 수락: 친구 요청 메세지 삭제");

    }

    // userFrom이 userTo에게 친구 추가 요청을 보냈는 지 확인
    public boolean alreadyFriend(String userFromEmail, String userToEmail) {

        User userFrom = userRepository.findUserByEmail(userFromEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));
        User userTo = userRepository.findUserByEmail(userToEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));

        Long fromId = userFrom.getId();
        Long toId = userTo.getId();

        List<Message> messages = messageRepository.findByUserFrom_IdAndUserTo_IdAndMsgType(fromId, toId, 0);

        // messages가 non empty list <-> 이미 친구 요청을 보냈음

        return !messages.isEmpty();

    }

}
