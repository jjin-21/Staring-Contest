package com.sixback.eyebird.api.service;

import com.sixback.eyebird.api.dto.GameResultReqDto;
import com.sixback.eyebird.db.entity.GameResult;
import com.sixback.eyebird.db.entity.User;
import com.sixback.eyebird.db.repository.GameResultRepository;
import com.sixback.eyebird.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GameResultService {

    private final UserRepository userRepository;
    private final GameResultRepository gameResultRepository;

    @Transactional
    public void addGameResult(GameResultReqDto gameResultReqDto) {
        User winner = userRepository.findUserByNickname(gameResultReqDto.getUserWinnerNickname()).orElseThrow(() -> new IllegalArgumentException("게임 결과 저장: 승자의 닉네임을 지닌 유저가 존재하지 않습니다"));
        User loser = userRepository.findUserByNickname(gameResultReqDto.getUserLoserNickname()).orElseThrow(() -> new IllegalArgumentException("게임 결과 저장: 패자의 닉네임을 지닌 유저가 존재하지 않습니다"));

        GameResult gameResult = GameResult.builder()
                .isItem(gameResultReqDto.isItem())
                .userWinner(winner)
                .userLoser(loser)
                .build();

        // 게임 결과 테이블에 저장
        gameResultRepository.save(gameResult);

    }

}
