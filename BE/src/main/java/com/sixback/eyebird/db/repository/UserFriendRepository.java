package com.sixback.eyebird.db.repository;

import com.sixback.eyebird.db.entity.User;
import com.sixback.eyebird.db.entity.UserFriend;
import io.lettuce.core.dynamic.annotation.Param;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


public interface UserFriendRepository extends JpaRepository<UserFriend, Long> {
    // 유저의 친구 모두 조회
    @Query("SELECT u FROM  UserFriend u WHERE u.userFrom.id = :userId OR u.userTo.id = :userId")
    List<UserFriend> findByUserFromOrUserTo(@Param("userId") long userId);

    // 유저 둘을 모두 포함하는 colum 조회
    @Query("SELECT u FROM UserFriend u WHERE (u.userFrom.id = :userFromId OR u.userTo.id = :userFromId) AND (u.userTo.id = :userToId OR u.userFrom.id = :userToId)")
    Optional<UserFriend> findByUserFromUserTo(@Param("userFromId") long userFromId,@Param("userToId") long userToId);
}
