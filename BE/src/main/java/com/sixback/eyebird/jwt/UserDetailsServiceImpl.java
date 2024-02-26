package com.sixback.eyebird.uncategorized;

import com.sixback.eyebird.db.repository.UserRepository;
import com.sixback.eyebird.db.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true) // 조회용 메서드
@RequiredArgsConstructor // 의존성 주입
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetailsImpl loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("해당 이메일을 지닌 유저가 존재하지 않습니다"));

        return new UserDetailsImpl(user);

    }


}
