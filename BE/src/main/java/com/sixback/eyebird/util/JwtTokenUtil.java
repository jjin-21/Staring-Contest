package com.sixback.eyebird.util;

import com.sixback.eyebird.api.dto.JwtTokenDto;
import com.sixback.eyebird.api.dto.LoginReqDto;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.security.Key;
import java.util.Date;

@Slf4j // 로그
@Component // 개발자가 직접 작성한 class를 bean으로 등록

public class JwtTokenUtil {
    private final Key key;

    public JwtTokenUtil(@Value("${jwt.secretKey}") String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Authentication으로 access, refresh token
    public JwtTokenDto generateToken(String email) {


        // 유저의 권한을 다룰 필요없음: 모든 유저는 동등함

        // 토큰 생성시간
        long now = (new Date()).getTime();

        // access token의 유효기간: 1시간 = 60 * 60 * 1000
        Date accessTokenExpiresIn = new Date(now + 3600000);
        String accessToken = Jwts.builder()
                .setSubject(email)
                .setExpiration(accessTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();


        // refresh token의 유효기간: 30일 = 30 * 24 * 60 * 60 * 1000
        Date refreshTokenExpiresIn = new Date(now + 2592000000L);
        // refresh token 생성
        // TODO refresh token의 setSubject는 필요없는가?
        String refreshToken = Jwts.builder()
                .setExpiration(refreshTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return JwtTokenDto.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // access token을 이용해 유저의 email 찾기
    public String getUserEmail(String accessToken) {
        // 토큰 복호화
        Claims claims = parseClaims(accessToken);

        String email = claims.getSubject();
        return email;
    }

    // token의 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch(io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("invalid jwt token", e);
            throw new MalformedJwtException("invalid jwt token");
        } catch(ExpiredJwtException e) {
            log.info("expired jwt token", e);
            throw new ExpiredJwtException(null,null,"expired jwt token");
        } catch(UnsupportedJwtException e) {
            log.info("unsupported jwt token", e);
            throw new UnsupportedJwtException("unsupported wjt token");
        }

//        return false;
    }

    // accessToken의 복호화
    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
        } catch(ExpiredJwtException e) { // jwt의 유효시간이 지났음
            return e.getClaims();
        }
    }

    // access token의 남은 유효기간 구하기
    public Long getExpiration(String accessToken) {
        Date expiration = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody().getExpiration();
        // 현재 시간
        Long now = new Date().getTime();
        return (expiration.getTime() - now);
    }

}
