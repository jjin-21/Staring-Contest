package com.sixback.eyebird.api.service;

import com.sixback.eyebird.api.dto.JwtTokenDto;
import com.sixback.eyebird.api.dto.LoginReqDto;
import com.sixback.eyebird.api.dto.LoginResDto;
import com.sixback.eyebird.db.repository.UserRepository;
import com.sixback.eyebird.db.entity.User;
import com.sixback.eyebird.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.ObjectUtils;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final RedisTemplate<String, Object> redisTemplate;


    public LoginResDto login(LoginReqDto loginReqDto) {
        String email = loginReqDto.getEmail();
        String password = loginReqDto.getPassword();

        // DB에서 유저 찾기
        User user = userRepository.findUserByEmail(email).orElseThrow(() ->new IllegalArgumentException("로그인: 해당 이메일을 지닌 유저가 존재하지 않습니다"));

        // 만약 유저가 삭제되었으면, 로그인 불가능
        if (user.isIfDeleted()) {
            throw new IllegalArgumentException("로그인: 해당 유저는 삭제된 유저입니다");
        }

        // 비밀번호 확인
        if (!encoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("로그인: 유저의 비밀번호가 올바르지 않습니다");
        }

        JwtTokenDto jwtTokenDto = jwtTokenUtil.generateToken(email);

        // refresh token을 redis에 저장: refresh token의 유효기간이 30일이므로, 30일 이후 redis에서 삭제
        redisTemplate.opsForValue()
                .set("RT:"+email, jwtTokenDto.getRefreshToken(), 2592000000L, TimeUnit.MILLISECONDS);

        return LoginResDto.builder().user(user).jwtTokenDto(jwtTokenDto).build();
    }


    public JwtTokenDto reissue(JwtTokenDto jwtTokenDto) {
        String accessToken = jwtTokenDto.getAccessToken();
        String refreshToken = jwtTokenDto.getRefreshToken();

        // refreshToken 검증
        if (!jwtTokenUtil.validateToken(refreshToken)) {
            throw new IllegalArgumentException("reissue: refresh token이 유효하지 않습니다");
        }

        // refreshToken이 redis에 저장된 refreshToken과 일치하는지 확인
        String email = jwtTokenUtil.getUserEmail(accessToken);
        // 직렬화
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
        String redisRefreshToken = (String) redisTemplate.opsForValue().get("RT:"+email);
        // 만약 로그아웃되어 redisRefreshToken이 없는 경우
        if (ObjectUtils.isEmpty(redisRefreshToken)) {
            throw new IllegalArgumentException(("reissue: 로그아웃 상태입니다: redis에 refresh token이 존재하지 않습니다"));
        }
        if (!redisRefreshToken.equals(refreshToken)) {
            throw new IllegalArgumentException("reissue: refresh token이 redis에 저장된 refresh token과 다릅니다");
        }

        // 새로운 access token, refresh token을 email로부터 생성함
        JwtTokenDto newJwtTokenDto = jwtTokenUtil.generateToken(email);

        // redis의 refresh token 업데이트: refresh token의 유효기간은 30일이므로, 30일 이후 redis에서 삭제
        redisTemplate.opsForValue()
                .set("RT:"+email, newJwtTokenDto.getRefreshToken(), 2592000000L, TimeUnit.MILLISECONDS);

        return newJwtTokenDto;
    }

    public void logout(JwtTokenDto jwtTokenDto) {
        // access token이 유효한지 확인한다
        String accessToken = jwtTokenDto.getAccessToken();
        if (!jwtTokenUtil.validateToken(accessToken)) {
            throw new IllegalArgumentException("logout: access token이 유효하지 않습니다");
        }

        String email = jwtTokenUtil.getUserEmail(accessToken);

        // redis의 refreshToken을 삭제한다
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(String.class));
        if (redisTemplate.opsForValue().get("RT:"+email) != null) {
            redisTemplate.delete("RT:"+email);
        }

        // redis에 access token을 블랙리스트로 저장해서, 추후 이 access token으로의 접근을 막는다
        Long expiration = jwtTokenUtil.getExpiration(accessToken);
        redisTemplate.opsForValue().set(accessToken, "logout", expiration, TimeUnit.MILLISECONDS);
    }
}
