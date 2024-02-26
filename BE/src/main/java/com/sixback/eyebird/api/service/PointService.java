package com.sixback.eyebird.api.service;

import com.fasterxml.jackson.databind.ser.std.StdKeySerializers;
import com.sixback.eyebird.api.dto.PointDto;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import com.sixback.eyebird.api.dto.PointReqDto;
import com.sixback.eyebird.db.entity.Point;
import com.sixback.eyebird.db.entity.User;
import com.sixback.eyebird.db.repository.PointRepository;
import com.sixback.eyebird.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointService {
    private final RedisTemplate<String, Object> redisTemplate; // 사용할 때 형변환 필요

    private final UserRepository userRepository;
    private final PointRepository pointRepository;

    @Transactional
    public void update(PointReqDto pointReqDto, String curUserEmail) {
        User curUser = userRepository.findUserByEmail(curUserEmail).orElseThrow(() -> new IllegalArgumentException("점수 업데이트: 이메일을 지닌 유저가 존재하지 않습니다"));
        Point point = pointRepository.findByUserId(curUser.getId()).orElseThrow(() -> new IllegalArgumentException("점수 업데이트: 유저의 점수 테이블이 존재하지 않습니다"));

        // 점수 업데이트
        point.update(pointReqDto);
        log.info(curUserEmail + "의 점수가 업데이트 되었습니다");
    }

    // 회원 가입 시 가입된 유저의 디폴트 점수를 저장: 아이템전, 클래식전 점수 모두 디폴트 값이 1000이다
    public void add(User signupUser) {
        Point point = Point.builder()
                .user(signupUser)
                .itemPt(1000)
                .classicPt(1000)
                .build();


        pointRepository.save(point);
        log.info(signupUser.getEmail() + "의 기본 점수가 DB에 저장되었습니다");
    }

    List<PointDto> rankList(boolean item) {
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(List.class));
        List<PointDto> points = new ArrayList<>();
        String pattern = "classicRank";

        if (item == true) {
            pattern = "itemRank";
        }
        if (redisTemplate.opsForValue().get(pattern) != null) {
            // 리스트로 저장했기 때문에 리스트로 받아야 한다.
            points = (List<PointDto>) redisTemplate.opsForValue().get(pattern);
        }
        return points;
    }

    public Integer getListSize(boolean item) {
        return rankList(item).size();
    }


    // 상위 유저 리스트 Redis -> Front
    public List<PointDto> getTopPoint(boolean item, int page) {
        List<PointDto> points = rankList(item);

        if (page == 1) {
            if (points.size() > 3)
                return points.subList(0, 3);
            else return points;
        }
        int pageidx = (page - 1) * 10 - 7;

        if (pageidx > points.size()) return new ArrayList<PointDto>();

        //만약 요구하는 것 보다 현재 랭크 수가 작다면
        if (pageidx + 10 >= points.size())
            return points.subList(pageidx, points.size());
        return points.subList(pageidx, pageidx + 10);
    }

    public List<PointDto> getUpDownScore(boolean item, String userEmail) {
        List<Point> rank = new ArrayList<>();
        if (item) {
            rank = pointRepository.findByOrderByItemPtDesc();
        } else {
            rank = pointRepository.findByOrderByClassicPtDesc();
        }

        if (rank.size() < 1) return null;

        // 유저 아이디로 앞 뒤 점수 찾아야함.
        System.out.println("+sdssssssssssssssssssss"+rank.size());
        int userRank = 0;
        for (int i = 0; i < rank.size(); i++) {
            if (rank.get(i).getUser().getEmail().equals(userEmail)) {
                userRank = i;
                break;
            }
        }

        // -> 본인 포함해서 랭크 전달
        // 랭크 가장 뒷 부분이면 앞의 두 사람
        if (userRank == (rank.size() - 1)) {
            userRank = userRank - 2;
        }
        // 랭크 가장 앞이면 뒤의 두 사람
        else if (userRank > 0) userRank = userRank - 1;

        List<PointDto> result = new ArrayList<PointDto>();

        for (int i = 0; i < 3; i++) {
            if (userRank + i < rank.size() && userRank >=0) {
                if (item)
                    result.add(new PointDto((userRank + 1) + i, rank.get(userRank + i).getUser().getNickname(), rank.get(userRank + i).getUser().getProfileImage(), rank.get(userRank + i).getItemPt()));
                else
                    result.add(new PointDto((userRank + 1) + i, rank.get(userRank + i).getUser().getNickname(), rank.get(userRank + i).getUser().getProfileImage(), rank.get(userRank + i).getClassicPt()));
            }
        }

        // 세 사람 출력
        return result;
    }

    // 갱신을 위한 스케쥴 DB -> Redis
    // 3분마다 업데이트 -> 3초마다 업데이트로 일시적 수정
    //@Scheduled(fixedRate = 18000)
    @Scheduled(fixedRate = 3000)
    public void updateRanking() {
        List<Point> itemRank = pointRepository.findByOrderByItemPtDesc();
        List<Point> classicRank = pointRepository.findByOrderByClassicPtDesc();

        int maxsize = 25;
        if (itemRank.size() < 25)
            itemRank = itemRank.subList(0, itemRank.size());
        else
            itemRank = itemRank.subList(0, maxsize);

        if (classicRank.size() < 25) {
            classicRank = classicRank.subList(0, classicRank.size());
        } else
            classicRank = classicRank.subList(0, maxsize);

        // 랭크가 있는 경우 = 유저가 존재하는 경우에 갱신.
        if (itemRank.size() > 0) {
            List<PointDto> itemRankList = new ArrayList<>();
            for (int i = 0; i < itemRank.size(); i++) {
                PointDto itemPoint = new PointDto(i + 1, itemRank.get(i).getUser().getNickname(), itemRank.get(i).getUser().getProfileImage(), itemRank.get(i).getItemPt());
                itemRankList.add(itemPoint);
            }

            redisTemplate.opsForValue().set("itemRank", itemRankList);
        }


        if (classicRank.size() > 0) {
            List<PointDto> classicRankList = new ArrayList<>();
            for (int i = 0; i < itemRank.size(); i++) {
                PointDto classicPoint = new PointDto(i + 1, classicRank.get(i).getUser().getNickname(), classicRank.get(i).getUser().getProfileImage(), classicRank.get(i).getClassicPt());
                classicRankList.add(classicPoint);
            }
            redisTemplate.opsForValue().set("classicRank", classicRankList);
        }
    }

}
