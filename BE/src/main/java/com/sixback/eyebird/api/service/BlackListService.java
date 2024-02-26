package com.sixback.eyebird.api.service;

import com.sixback.eyebird.api.dto.BlackListDto;
import com.sixback.eyebird.api.dto.RoomDto;
import com.sixback.eyebird.util.Sha256Convert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BlackListService {
    // template를 범용으로 설정했기 때문에 value값은 Object고 형변환해서 사용해야함.
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public boolean addBlackList(BlackListDto blacklist) {
        ArrayList<String> curRoomList = new ArrayList<>();
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(ArrayList.class));

        String roomId = Sha256Convert.ShaEncoder(blacklist.getRoomName());

        //pattern
        String key = "blacklist_" + roomId;

        // 현재 방에 있는 블랙리스트 리스트 불러오기
        if (redisTemplate.opsForValue().get(key) != null)
            curRoomList = (ArrayList<String>) redisTemplate.opsForValue().get(key);


        // 블랙리스트 추가
        curRoomList.add(blacklist.getEmail());

        // 블랙리스트 저장
        redisTemplate.opsForValue().set(key, curRoomList);
        return true;
    }

    // 해당 방의 블랙리스트 받아오기
    public ArrayList<String> blacklist(String roomId) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(ArrayList.class));

        ArrayList<String> curRoomList = new ArrayList<>();

        //pattern
        String key = "blacklist_" + roomId;

        // 현재 방에 있는 블랙리스트 리스트 불러오기
        if (redisTemplate.opsForValue().get(key) != null)
            curRoomList = (ArrayList<String>) redisTemplate.opsForValue().get(key);

        return curRoomList;
    }

    // 블랙리스트 삭제 - 룸 컨트롤러가 방을 삭제할 때 같이 삭제할것
    public boolean deleteBlackList(String roomId) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(ArrayList.class));

        if (redisTemplate.opsForValue().get("blacklist_" + roomId) != null) {
            redisTemplate.delete("blacklist_" + roomId);
            return true;
        }
        return false;
    }

}
