package com.sixback.eyebird.db.entity;


import com.sixback.eyebird.api.dto.MessageResDto;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class GameResult extends BaseTime{
    @Id
    @GeneratedValue
    private Long id;

    // 랭크 게임이 아이템 전이었는지의 여부
    private boolean ifItem;

    // 랭크 게임의 승자
    @ManyToOne
    @JoinColumn(name="user_winner_id")
    private User userWinner;

    // 랭크 게임의 패자
    @ManyToOne
    @JoinColumn(name="user_loser_id")
    private User userLoser;

    @Builder
    public GameResult(boolean isItem, User userWinner, User userLoser) {
        this.ifItem = isItem;
        this.userWinner = userWinner;
        this.userLoser = userLoser;
    }

}
