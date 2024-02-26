package com.sixback.eyebird.api.controller;

import com.sixback.eyebird.api.dto.GameResultReqDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sixback.eyebird.api.service.GameResultService;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/game-result")
public class GameResultController {

    private final GameResultService gameResultService;
    @PostMapping("")
    public ResponseEntity<Void> addGameResult(@RequestBody @Valid GameResultReqDto gameResultReqDto) {
             gameResultService.addGameResult(gameResultReqDto);

             return ResponseEntity.ok().build();

    }
}
