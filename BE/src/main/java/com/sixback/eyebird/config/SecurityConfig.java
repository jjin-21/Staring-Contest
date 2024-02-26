package com.sixback.eyebird.config;

import com.sixback.eyebird.uncategorized.AuthEntryPointJwt;
import com.sixback.eyebird.uncategorized.JwtAuthFilter;
import com.sixback.eyebird.uncategorized.UserDetailsServiceImpl;
import com.sixback.eyebird.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.*;
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor // 의존성 주입을 위해 필요
public class SecurityConfig {
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final JwtTokenUtil jwtTokenUtil;
    private final RedisTemplate<String, Object> redisTemplate;
    private final AuthEntryPointJwt unauthorizedHandler;
    private static final String[] AUTH_WHITELIST = {
        "/swagger-ui/**", "/v3/api-docs/**", "/api/auth/login", "/api/auth/logout", "/api/auth/reissue", "/api/user/signup", "/api/user/check/nickname", "/api/user/check/email",
            "/api/sessions", "/api/sessions/{sessionId}/connections", "/api/ws/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.httpBasic(HttpBasicConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement((sessionManagement) ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .formLogin((form) -> form.disable())
                .headers(header -> header.frameOptions(options -> options.sameOrigin()))
                .addFilterBefore(new JwtAuthFilter(jwtTokenUtil, userDetailsServiceImpl, redisTemplate), UsernamePasswordAuthenticationFilter.class) // jwtAuthFilter를 UsernamePasswordAuthenticationFilter 이전에 실행
                .authorizeHttpRequests(auth -> auth.requestMatchers(AUTH_WHITELIST).permitAll() // 접근 허용
                        //.requestMatchers(toH2Console()).permitAll() // h2 database 사용을 위해
                        .anyRequest().authenticated() // 이외의 endpoint 들은 인증 요구
                );





        return http.build();

    }

    // passwordEncoder를 위해 필요함
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
