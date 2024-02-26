package com.sixback.eyebird.api.service;

import com.sixback.eyebird.api.dto.UserReqDto;
import com.sixback.eyebird.db.entity.User;
import com.sixback.eyebird.db.entity.UserFriend;
import com.sixback.eyebird.db.repository.UserFriendRepository;
import com.sixback.eyebird.db.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.LongSummaryStatistics;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class UserFriendService {
    @Autowired
    private final UserFriendRepository userFriendRepository;

    @Autowired
    private final UserRepository userRepository;

    public boolean createFriend(String toNickName, String fromEmail) {
        UserFriend userFriend = new UserFriend();
        userFriend.setUserTo(userRepository.findUserByNickname(toNickName).orElseThrow(() -> new RuntimeException("유저를 찾지 못했습니다.")));
        userFriend.setUserFrom(userRepository.findUserByEmail(fromEmail).orElseThrow(() -> new RuntimeException("유저를 찾지 못했습니다.")));
        userFriendRepository.save(userFriend);

        return true;
    }

    // 유저가 가진 아이디로 친구 불러오기
    public List<UserReqDto> findFriend(String userEmail, int page) {
        System.out.println(userEmail);
        User user = userRepository.findUserByEmail(userEmail).orElseThrow(() -> new RuntimeException("유저를 찾지 못했습니다."));
        System.out.println("test");
        long userId = user.getId();
        List<UserFriend> friendList = userFriendRepository.findByUserFromOrUserTo(userId);
        System.out.println(friendList);
        List<UserReqDto> friends = new ArrayList<>();

        for(int i = 0; i<friendList.size(); i++){
            long from = friendList.get(i).getUserFrom().getId();
            long to = friendList.get(i).getUserTo().getId();

            if(from == userId){
                user = userRepository.findUserById(to).orElseThrow(() -> new RuntimeException("유저를 찾지 못했습니다."));
                friends.add(new UserReqDto(user.getEmail(),user.getNickname(),user.getProfileImage(), user.getPoint().getClassicPt(), user.getPoint().getItemPt(),user.getWinGameResults().size(), user.getLoseGameResults().size()));
            }
            else if(to == userId){
                user = userRepository.findUserById(from).orElseThrow(() -> new RuntimeException("유저를 찾지 못했습니다."));
                friends.add(new UserReqDto(user.getEmail(),user.getNickname(),user.getProfileImage(), user.getPoint().getClassicPt(), user.getPoint().getItemPt(),user.getWinGameResults().size(), user.getLoseGameResults().size()));
            }
        }

        friends.sort((f1,f2)->f1.getNickname().compareTo(f2.getNickname()));

        System.out.println(friends);

        int pageindex = (page-1)*10;
        int pageend = pageindex + 10;
        if(pageindex + 10 >= friendList.size())
            pageend = friendList.size();


        if(pageindex > friends.size())
            friends = new ArrayList<>();
        else
            friends = friends.subList(pageindex,pageend);
        return friends;
    }

    // 친구 제거
    public void deleteFriendShip(String toNickName, String fromEmail) {
        User user1 = userRepository.findUserByNickname(toNickName).orElseThrow(() -> new RuntimeException("유저를 찾지 못했습니다."));
        // 현재 유저의 정보는 Email로 받아오기 때문에 Email로 검색하게 된다.
        User user2 = userRepository.findUserByEmail(fromEmail).orElseThrow(() -> new RuntimeException("유저를 찾지 못했습니다."));

        Optional<UserFriend> friendship = userFriendRepository.findByUserFromUserTo(user1.getId(), user2.getId());
        UserFriend userFriend = friendship.orElseThrow(() -> new RuntimeException("친구 관계를 찾지 못했습니다."));
        userFriendRepository.delete(userFriend);

    }

    // firstUser와 secondUser가 친구인지 확인
    public boolean alreadyFriend(Long firstUserId, Long secondUserId) {
        UserFriend userFriend = userFriendRepository.findByUserFromUserTo(firstUserId, secondUserId).orElseThrow(() -> new IllegalArgumentException(""));
        return false;
    }

}
