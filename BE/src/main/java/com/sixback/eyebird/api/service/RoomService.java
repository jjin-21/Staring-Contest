package com.sixback.eyebird.api.service;

import com.sixback.eyebird.api.dto.RoomDto;
import com.sixback.eyebird.util.Sha256Convert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    @Autowired
    RedisTemplate<String, Object> redisTemplate; // JSON 형태로 저장 가능
    @Autowired
    BlackListService blackListService;

    // 방 만들기
    public int createRoom(RoomDto room) {
        // 명시적인 타입 정보 제공
        // Jackson2JsonRedisSerializer나 GenericJackson2JsonRedisSerializer를 사용할 때,
        // 역직렬화할 객체의 정확한 타입을 명시해야 합니다. 정확한 직렬화 방식을 설정합니다.
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(RoomDto.class));

        //찾아서 만들수있는지 체크해야함.
        //못민드는 경우 1 : 최대 방 수 초과
        long count = 0;
        String pattern = "room*";

        List<RoomDto> rooms = new ArrayList<>();
        Cursor<byte[]> cursor = redisTemplate.getConnectionFactory().getConnection().scan(ScanOptions.scanOptions().match(pattern).build());
        while (cursor.hasNext()) {
            String key = new String(cursor.next());
            if (redisTemplate.opsForValue().get(key) != null) {
                RoomDto existsRoom = (RoomDto) redisTemplate.opsForValue().get(key);
                rooms.add(existsRoom);
                count++;
            }
        }
        if (count > 30) return 0;

        //못만드는 경우2 : 방 이름 중복
        if (rooms.size() > 0)
            for (RoomDto check : rooms) {
                if (room.getRoomName().equals(check.getRoomName())) {
                    return -1;
                }
            }


        // 방 생성 가능 : 방 저장하고 true 리턴
        redisTemplate.opsForValue().set("room_" + room.getRoomId(), room);
        return 1;
    }

    // 룸 찾기
    public RoomDto findRoom(String id) {
        RoomDto room = new RoomDto();
        if (redisTemplate.opsForValue().get("room_" + id) != null) {
            room = (RoomDto) redisTemplate.opsForValue().get("room_" + id);
        }
        //비밀번호 clear
        room.setPassword(0);
        return room;
    }

    // Redis에서 room으로 시작하는 key값을 검색합니다.
    // RoomId 받아오기 때문에 String
    public List<RoomDto> getRoomList(boolean item) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(RoomDto.class));
        List<RoomDto> rooms = new ArrayList<>();
        String pattern = "room*";

        // Scan 명령어 사용해서 검색 : 데이터베이스 크기에 상관없이 일정한 성능을 유지
        // 일치하는 키에 대해 get 연산을 수행해서 각 키가 가진 room 객체를 가져옴
        Cursor<byte[]> cursor = redisTemplate.getConnectionFactory().getConnection().scan(ScanOptions.scanOptions().match(pattern).build());

        while (cursor.hasNext()) {
            String key = new String(cursor.next());
            RoomDto room = new RoomDto();
            if (redisTemplate.opsForValue().get(key) != null)
                room = (RoomDto) redisTemplate.opsForValue().get(key);

            // 아이템전 여부 확인하고 추가
            if (room.isItem() == item && !room.isStatus()) {
                rooms.add(room);

                room.setPassword(0);
            }
        }
        return rooms;
    }

    //방 들어가기

    /**
     * @param room
     * @param userEmail
     * @return 1 : 성공
     * 0 : 방 없음
     * -1 : 인원 초과
     * -2 : 비번 틀림
     * -3 : 블랙리스트
     */
    public int enterRoom(RoomDto room, String userEmail, boolean invite) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(RoomDto.class));

        // 미리 pw 저장
        int pw = room.getPassword();

        // 룸 id로 key값을 조회해 해당 방을 가져옴
        if (redisTemplate.opsForValue().get("room_" + room.getRoomId()) != null) {
            room = (RoomDto) redisTemplate.opsForValue().get("room_" + room.getRoomId());
        }

        // 방이 없으면 false
        if (room.getRoomName() == null) return 0;

        // 현재 인원이 max값보다 많은
        if (room.getMaxCapacity() <= room.getCurrentCapacity()) {
            System.out.println("적정인원");
            return -1;
        }

        if (!invite) {

            //password 확인
            if (room.getPassword() != pw) {
                return -2;
            }

            System.out.println("비번확인");
            // 블랙리스트 블락
            ArrayList<String> blacklist = blackListService.blacklist(room.getRoomId());

            if (blacklist.size() > 0) {
                for (int i = 0; i < blacklist.size(); i++) {
                    if (userEmail.equals(blacklist.get(i))) {
                        return -3;
                    }
                }
            }
        }

        //방 인원 하나 늘리고
        room.addCapacity();
        // 다시 저장
        redisTemplate.opsForValue().set("room_" + room.getRoomId(), room);

        return 1;
    }


    public RoomDto quickEnterRoom(boolean isItem, String email) {
        // 1. 방 목록 불러오기
        // 2. 블랙리스트 확인
        // 3. 입장

        // 모든 룸 정보 받아오기
        List<RoomDto> rlist;
        rlist = getRoomList(isItem);

        for (int i = 0; i < rlist.size(); i++) {
            // 해당 방이 가득 차 있으면 입장 불가.
            if (rlist.get(i).getCurrentCapacity() >= rlist.get(i).getMaxCapacity()) continue;

            // 비밀 번호가 있으면 입장 불가
            if (rlist.get(i).getPassword() != 0) continue;

            // 해당 방에 블랙리스트면 입장 불가
            ArrayList<String> blacklist = blackListService.blacklist(rlist.get(i).getRoomId());
            boolean blist = false;
            for (int j = 0; j < blacklist.size(); i++) {
                if (email.equals(blacklist.get(j))) {
                    blist = true;
                    break;
                }
            }
            if (blist) continue;

            RoomDto room = rlist.get(i);

            return room;
        }

        return null;
    }

    // 방 삭제
    public boolean deleteRoom(String key) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(RoomDto.class));

        RoomDto room = new RoomDto();
        if (redisTemplate.opsForValue().get("room_" + key) != null) {
            room = (RoomDto) redisTemplate.opsForValue().get("room_" + key);
        }

        System.out.println(room);
        if (room.getRoomName() == null) return false;

        // 1. 유저 수 줄이기.
        room.reduceCapacity();

        // 다시 저장
        redisTemplate.opsForValue().set("room_" + room.getRoomId(), room);

        // 2. 유저가 없으면 방 삭제
        if (room.getCurrentCapacity() < 1) {
            redisTemplate.delete("room_" + key);
            blackListService.deleteBlackList(room.getRoomId());
        }
        return true;

    }

    //방 상태 변경
    public RoomDto changeStatus(RoomDto room) {
        // status 저장
        boolean status = room.isStatus();
        room = findRoom(room.getRoomId());

        // 변경할 status로 변경
        room.setStatus(status);

        // 다시 저장
        redisTemplate.opsForValue().set("room_" + room.getRoomId(), room);

        return room;
    }

}
