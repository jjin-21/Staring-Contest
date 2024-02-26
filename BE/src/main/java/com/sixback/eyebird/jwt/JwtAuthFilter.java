package com.sixback.eyebird.uncategorized;

import ch.qos.logback.core.CoreConstants;
import com.sixback.eyebird.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final RedisTemplate<String, Object> redisTemplate;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
      String authorizationHeader = request.getHeader("Authorization");

      // JWT가 헤더에 있다면
      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
          String token = authorizationHeader.substring(7);
          log.info(token);
          // access token가 유효하다면
          if (jwtTokenUtil.validateToken(token)) {

              // 로그아웃 처리된 access token인지 확인
              String isLogout = (String) redisTemplate.opsForValue().get(token);
              // 로그아웃 처리된 access token이 아니라면,
              if (ObjectUtils.isEmpty(isLogout)) {
                  String email = jwtTokenUtil.getUserEmail(token);

                  UserDetailsImpl userDetailsImpl = userDetailsServiceImpl.loadUserByUsername(email);

                  if (userDetailsImpl != null) {
                      UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                              new UsernamePasswordAuthenticationToken(userDetailsImpl, null, null); // UserDetails, password, role
                      // 현재 request의 security context에 접근권한 설정
                      SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

                  }
              }


          }

      }

      filterChain.doFilter(request, response); // 다음 필터로 넘어가기

    }
}
