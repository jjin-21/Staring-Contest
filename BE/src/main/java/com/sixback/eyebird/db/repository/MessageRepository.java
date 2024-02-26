package com.sixback.eyebird.db.repository;

import com.sixback.eyebird.db.entity.GameResult;
import com.sixback.eyebird.db.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // '나'에게 온 모든 메세지를 타입에 따라(친구 요청 추가, 쪽지) 순서대로 가져오기
    List<Message> findByUserTo_IdAndMsgTypeOrderByCreatedDate(Long id, int msgType);

    // userFrom과 userTo 사이의 친구 추가 메세지가 있는지 확인. msgType은 항상 0이다.
   List<Message> findByUserFrom_IdAndUserTo_IdAndMsgType(Long fromId, Long toId, int msgType);

}
