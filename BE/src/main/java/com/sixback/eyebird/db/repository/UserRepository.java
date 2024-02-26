package com.sixback.eyebird.db.repository;

import com.sixback.eyebird.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserByEmail(String email);

    Optional<User> findUserByNickname(String nickname);
    Optional<User> findUserById(long id);
    Boolean existsByEmail(String email);
    Boolean existsByNickname(String nickname);

    // 문자열을 포함하는 닉네임을 지닌 유저들을 모두 검색
    List<User> findByNicknameContaining(String searchWord);

}
