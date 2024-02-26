package com.sixback.eyebird.api.controller;

import com.sixback.eyebird.api.dto.JwtTokenDto;
import com.sixback.eyebird.api.dto.LoginReqDto;
import com.sixback.eyebird.api.dto.LoginResDto;
import com.sixback.eyebird.api.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor // 의존성 주입
@RequestMapping("/api/auth")
@Tag(name = "Auth")
public class AuthController {

    private final AuthService authService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResDto> login(@RequestBody @Valid LoginReqDto loginReqDto) {
        LoginResDto loginResDto = authService.login(loginReqDto);
        return ResponseEntity.ok(loginResDto);
    }

    // refresh token 재발급
    @PostMapping("/reissue")
    public ResponseEntity<JwtTokenDto> reissue(@RequestBody @Valid JwtTokenDto jwtTokenDto) {
        JwtTokenDto newJwtTokenDto = authService.reissue(jwtTokenDto);
        return ResponseEntity.ok(newJwtTokenDto);
    }

    // logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody @Valid JwtTokenDto jwtTokenDto) {
        authService.logout(jwtTokenDto);
        return ResponseEntity.ok().build();
    }

    // auth 테스트
    @GetMapping("/auth-test")
    public ResponseEntity<String> authTest() {

        return ResponseEntity.ok("auth-test success");
    }

    // exception 테스트
    @GetMapping("/exception-test")
    public ResponseEntity<?> exceptionTest() {
        throw new IllegalArgumentException("exception-test");


    }



}
