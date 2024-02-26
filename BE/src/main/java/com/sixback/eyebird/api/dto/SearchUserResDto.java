package com.sixback.eyebird.api.dto;

import com.sixback.eyebird.db.entity.GameResult;
import com.sixback.eyebird.db.entity.Point;
import com.sixback.eyebird.db.entity.User;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class SearchUserResDto {
    @NotBlank
    private String email;
    @NotBlank
    private String nickname;
    private int profileImage;
    private int classicPt;
    private int itemPt;
    private int winNumItem;
    private int loseNumItem;
    private int winNumClassic;
    private int loseNumClassic;

    @Builder
    public SearchUserResDto(User user) {
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.profileImage = user.getProfileImage();

        Point point = user.getPoint();
        this.classicPt = point.getClassicPt();
        this.itemPt = point.getItemPt();

        List<GameResult> winGameResults = user.getWinGameResults();
        List<GameResult> loseGameResults = user.getLoseGameResults();

        int winNum = winGameResults.size();
        int loseNum = loseGameResults.size();

        int winNumItem = 0;
        int loseNumItem = 0;

        for (GameResult g: winGameResults) {
            if (g.isIfItem()) winNumItem++;
        }

        for (GameResult g: loseGameResults) {
            if (g.isIfItem()) loseNumItem++;
        }

        this.winNumItem = winNumItem;
        this.loseNumItem = loseNumItem;
        this.winNumClassic = winNum - winNumItem;
        this.loseNumClassic = loseNum - loseNumItem;

    }
}
