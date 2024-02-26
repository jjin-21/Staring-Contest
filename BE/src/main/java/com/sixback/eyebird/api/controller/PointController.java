package com.sixback.eyebird.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixback.eyebird.api.dto.*;
import com.sixback.eyebird.api.service.PointService;
import com.sixback.eyebird.db.repository.UserRepository;
import com.sixback.eyebird.uncategorized.OpenViduManager;
import com.sixback.eyebird.db.entity.User;
import com.sixback.eyebird.util.EloUtil;
import io.openvidu.java.client.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import com.sixback.eyebird.api.dto.PointReqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.PriorityBlockingQueue;

@RestController
@RequestMapping("/api/point")
@RequiredArgsConstructor
@Tag(name = "Point")
@Slf4j
public class PointController {
    private final PointService pointService;

    
    // 아이템전 매칭 요청이 들어온 유저들을 담은 queue
    //private final Queue<String> matchingQueueItem = new ConcurrentLinkedQueue<>();
    // 클래식전 매칭 요청이 들어온 유저들을 담은 queue
    //private final Queue<String> matchingQueueClassic = new ConcurrentLinkedQueue<>();

    // 아이템전 매칭 요청이 들어온 유저들을 담은 priority queue
    private final PriorityBlockingQueue<MatchingReqDto> matchingPriorityQueueItem = new PriorityBlockingQueue<>(20, (d1, d2) -> d1.getPoint() - d2.getPoint());

    // 클래식전 매칭 요청이 들어온 유저들을 담은 priority queue
    private final PriorityBlockingQueue<MatchingReqDto> matchingPriorityQueueClassic = new PriorityBlockingQueue<>(20, (d1, d2) -> d1.getPoint() - d2.getPoint());


    // 아이템전 매칭
    private final SimpMessagingTemplate messagingTemplate;

    // openvidu 실행을 위해
    private final OpenViduManager openViduManager;

    private final UserRepository userRepository;

    private final ObjectMapper objectMapper;

    // elo point 승점 반영
    private final EloUtil eloUtil;

    // 랭크 게임 후 현재 유저의 점수를 변동
    @Operation(summary = "포인트 갱신", description = "Front -> Back -> DB")
    @PatchMapping("")
    public ResponseEntity<Void> update(@RequestBody PointReqDto pointReqDto, Authentication authentication) {
        String curUserEmail = authentication.getName();
        pointService.update(pointReqDto, curUserEmail);

        return ResponseEntity.ok().build();
    }


    //받아오기
    @GetMapping("/rank/item/{page}")
    @Operation(summary = "아이템 랭크 받아오기", description = "redis에서 item rank 받아오기")
    public ResponseEntity<Map<String, Object>> getRankList(@PathVariable int page){
        Map<String, Object> response = new HashMap<>();
        List<PointDto> test = pointService.getTopPoint(true, page);
        response.put("total", pointService.getListSize(true));
        response.put("rankList", test);
        return  new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/rank/classic/{page}")
    @Operation(summary = "클래식 랭크 받아오기", description = "redis에서 classic rank 받아오기")
    public ResponseEntity<Map<String, Object>> listTopClassicPoint(@PathVariable int page) {
        Map<String, Object> response = new HashMap<>();
        List<PointDto> test = pointService.getTopPoint(false, page);
        response.put("total", pointService.getListSize(false));
        response.put("rankList", test);
        return  new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/rank/myrank/classic")
    @Operation(summary = "클래식 랭크 받아오기", description = "redis에서 classic rank 받아오기")
    public ResponseEntity<List<PointDto>> getUpDownClassicScore(Authentication authentication){
        String curUserEmail = authentication.getName();

        List<PointDto> response = pointService.getUpDownScore(false, curUserEmail);
        if(response != null)
            return  new ResponseEntity<>(response, HttpStatus.OK);
        
        throw new RuntimeException("점수 불러오기 실패");
    }

    @GetMapping("/rank/myrank/item")
    @Operation(summary = "아이템 랭크 받아오기", description = "redis에서 아이템 rank 받아오기")
    public ResponseEntity<List<PointDto>> getUpDownItemScore(Authentication authentication){
        String curUserEmail = authentication.getName();

        List<PointDto> response = pointService.getUpDownScore(true, curUserEmail);
        if(response != null)
            return  new ResponseEntity<>(response, HttpStatus.OK);

        throw new RuntimeException("점수 불러오기 실패");
    }

    // 랭크 게임의 매칭 요청이 왔을 때
    @Transactional
    @MessageMapping("/matching")
    public void matching(MatchingReqDto matchingReqDto) throws OpenViduJavaClientException, OpenViduHttpException, JsonProcessingException {

        boolean isItem = matchingReqDto.isIfItem();
        log.info(matchingReqDto.toString());

        // 아이템전 매칭 요청인 경우
        if (isItem) {
            matchingPriorityQueueItem.offer(matchingReqDto);

            if (matchingPriorityQueueItem.size() >= 2) {
                String firstUserEmail = matchingPriorityQueueItem.poll().getEmail();
                String secondUserEmail = matchingPriorityQueueItem.poll().getEmail();
                User firstUser = userRepository.findUserByEmail(firstUserEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));
                User secondUser = userRepository.findUserByEmail(secondUserEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));

                //  두 유저에게 openvidu sessionId를 알려준다
                // 길이가 20인 랜덤 문자열 생성
                String randomString = RandomStringUtils.randomAlphanumeric(20);

                // 그 랜덤 문자열로 Openvidu Session 생성
                Map<String, Object> openviduParams = new HashMap<String, Object>();
                openviduParams.put("customSessionId", randomString);

                SessionProperties properties = SessionProperties.fromJson(openviduParams).build();
                OpenVidu openvidu = openViduManager.getOpenvidu();
                Session session = openvidu.createSession(properties);

                // firstUser와 secondUser의 현재 점수
                int firstUserPt = firstUser.getPoint().getItemPt();
                int secondUserPt = secondUser.getPoint().getItemPt();

                // 첫번째, 두번째 유저의 예상 승점
                int[] expectedWinPts = eloUtil.getExpectedWinPts(firstUserPt, secondUserPt);

                // 첫번째, 두번째 유저의 예상 패점
                int[] expectedLosePts = eloUtil.getExpectedLosePts(firstUserPt, secondUserPt);

                // 각 유저 상대방 유저의 정보와 sessionId를 전달
                OpenviduSessionIdResDto firstUserOpenviduSessionIdResDto = OpenviduSessionIdResDto.builder()
                        .openviduSessionId(session.getSessionId())
                        .user(secondUser)
                        .expectedWinPt(expectedWinPts[0])
                        .expectedLosePt(expectedLosePts[0])
                        .build();

                OpenviduSessionIdResDto secondUserOpenviduSessionIdResDto = OpenviduSessionIdResDto.builder()
                        .openviduSessionId(session.getSessionId())
                        .user(firstUser)
                        .expectedWinPt(expectedWinPts[1])
                        .expectedLosePt(expectedLosePts[1])
                        .build();

                String jsonFirstUserOpenviduSessionIdResDto = objectMapper.writeValueAsString(firstUserOpenviduSessionIdResDto);
                String jsonSecondUserOpenviduSessionIdResDto = objectMapper.writeValueAsString(secondUserOpenviduSessionIdResDto);

                messagingTemplate.convertAndSend("/user/match/"  + firstUserEmail, jsonFirstUserOpenviduSessionIdResDto);
                messagingTemplate.convertAndSend("/user/match/" + secondUserEmail, jsonSecondUserOpenviduSessionIdResDto);

            }

        }

        // 클래식전 매칭 요청인 경우
        else {
            matchingPriorityQueueClassic.add(matchingReqDto);

            if (matchingPriorityQueueClassic.size() >= 2) {
                String firstUserEmail = matchingPriorityQueueClassic.poll().getEmail();
                String secondUserEmail = matchingPriorityQueueClassic.poll().getEmail();
                User firstUser = userRepository.findUserByEmail(firstUserEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));
                User secondUser = userRepository.findUserByEmail(secondUserEmail).orElseThrow(() -> new IllegalArgumentException("해당 이메일을 지닌 유저가 존재하지 않습니다"));

                // 두 유저에게 openvidu sessionId를 알려준다
                // 길이가 20인 랜덤 문자열 생성
                String randomString = RandomStringUtils.randomAlphanumeric(20);

                // 그 랜덤 문자열로 Openvidu Session 생성
                Map<String, Object> openviduParams = new HashMap<String, Object>();
                openviduParams.put("customSessionId", randomString);

                SessionProperties properties = SessionProperties.fromJson(openviduParams).build();
                OpenVidu openvidu = openViduManager.getOpenvidu();
                Session session = openvidu.createSession(properties);

                // firstUser와 secondUser의 현재 점수
                int firstUserPt = firstUser.getPoint().getClassicPt();
                int secondUserPt = secondUser.getPoint().getClassicPt();

                // 첫번째, 두번째 유저의 예상 승점
                int[] expectedWinPts = eloUtil.getExpectedWinPts(firstUserPt, secondUserPt);

                // 첫번째, 두번째 유저의 예상 패점
                int[] expectedLosePts = eloUtil.getExpectedLosePts(firstUserPt, secondUserPt);

                // 각 유저 상대방 유저의 정보와 sessionId를 전달
                OpenviduSessionIdResDto firstUserOpenviduSessionIdResDto = OpenviduSessionIdResDto.builder()
                        .openviduSessionId(session.getSessionId())
                        .user(secondUser)
                        .expectedWinPt(expectedWinPts[0])
                        .expectedLosePt(expectedLosePts[0])
                        .build();

                OpenviduSessionIdResDto secondUserOpenviduSessionIdResDto = OpenviduSessionIdResDto.builder()
                        .openviduSessionId(session.getSessionId())
                        .user(firstUser)
                        .expectedWinPt(expectedWinPts[1])
                        .expectedLosePt(expectedLosePts[1])
                        .build();

                String jsonFirstUserOpenviduSessionIdResDto = objectMapper.writeValueAsString(firstUserOpenviduSessionIdResDto);
                String jsonSecondUserOpenviduSessionIdResDto = objectMapper.writeValueAsString(secondUserOpenviduSessionIdResDto);


                // 각 유저에게 openvidu의 sessionId 전달
                // sessionId뿐 만 아니라 상대방 유저의 정보또한 돌려준다.
                messagingTemplate.convertAndSend("/user/match/"  + firstUserEmail, jsonFirstUserOpenviduSessionIdResDto);
                messagingTemplate.convertAndSend("/user/match/" + secondUserEmail, jsonSecondUserOpenviduSessionIdResDto);

            }

        }

    }

    // 매칭 요청 취소
    @MessageMapping("/stomp/matching-cancel")
    public void matchingCancel(MatchingReqDto matchingReqDto) {
        boolean isItem = matchingReqDto.isIfItem();
        String userEmail = matchingReqDto.getEmail();
        log.info(matchingReqDto.toString());
        // 아이템전 매칭 요청 취소인 경우
        if (isItem) {
            //  remove
            List<MatchingReqDto> list = new ArrayList<>();
            while (!matchingPriorityQueueItem.isEmpty()) {
                MatchingReqDto polled = matchingPriorityQueueItem.poll();

                if (polled.equals(matchingReqDto)) break;

                list.add(polled);

            }

            for (MatchingReqDto m: list) {
                matchingPriorityQueueItem.offer(m);
            }

         }

        // 클래식전 매칭 요청 취소인 경우
        else {
            //  remove
            List<MatchingReqDto> list = new ArrayList<>();
            while (!matchingPriorityQueueClassic.isEmpty()) {
                MatchingReqDto polled = matchingPriorityQueueClassic.poll();

                if (polled.equals(matchingReqDto)) break;

                list.add(polled);

            }

            for (MatchingReqDto m: list) {
                matchingPriorityQueueClassic.offer(m);
            }
        }
    }

    // 매칭 요청이 성공해서 openvidu의 sessionId를 받은 후, session의 token을 발급해줌
    @PostMapping("/matching")
    public ResponseEntity<MatchingResDto> matchingConnectionToken(@RequestBody MatchingTokenReqDto matchingTokenReqDto, @RequestBody(required = false) Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        // openvidu의 sessionId
        String sessionId = matchingTokenReqDto.getSessionId();
        // sessionId로 token 받기
        OpenVidu openvidu = openViduManager.getOpenvidu();
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            throw new RuntimeException("방 입장: sessionId를 지닌 session이 존재하지 않습니다");
        }

        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        MatchingResDto matchingResDto = MatchingResDto.builder()
                .connectionToken(connection.getToken())
                .build();

        return ResponseEntity.ok(matchingResDto);

    }

    // openvidu sessionId를 받고, token을 발금함
    @PostMapping("/enter")
    public ResponseEntity<MatchingGameResDto> enter(@RequestBody MatchingGameReqDto matchingGameReqDto, @RequestBody(required = false) Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        OpenVidu openvidu = openViduManager.getOpenvidu();
        Session session = openvidu.getActiveSession(matchingGameReqDto.getGameId());
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        MatchingGameResDto matchingGameResDto = MatchingGameResDto.builder()
                .token(connection.getToken())
                .build();

        return ResponseEntity.ok().body(matchingGameResDto);
    }


}
