package com.sixback.eyebird.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EloUtil {
    // normalization을 위한 상수
    private final int k = 32;


    // 첫번째 유저와 두번째 유저의 승리 시 예상 승점을 각각 계산
    public int[] getExpectedWinPts(int firstUserPt, int secondUserPt) {
        int ratingDiff = firstUserPt - secondUserPt;

        int firstExpectedWinPt = (int) Math.floor(k * (1 / (1 + Math.pow(10, ratingDiff / 800))));
        int secondExpectedWinPt = (int) Math.floor(k * (1 / ( 1 + Math.pow(10, -ratingDiff / 800))));

        int[] ans = new int[2];
        ans[0] = firstExpectedWinPt;
        ans[1] = secondExpectedWinPt;

        return ans;

    }

    public int[] getExpectedLosePts(int firstUserPt, int secondUserPt) {
        int ratingDiff =  secondUserPt - firstUserPt;

        int firstExpectedLosePt = - (int) Math.floor(k * (1 / (1 + Math.pow(10, ratingDiff / 800))));
        int secondExpectedLosePt = - (int) ((Math.floor(k * (1 / (1 + Math.pow(10, - ratingDiff / 800))))));

        int[] ans = new int[2];
        ans[0] = firstExpectedLosePt;
        ans[1] = secondExpectedLosePt;

        return ans;
    }

    // firstUser가 이기면 result = 1, 비기면 0, 지면 0.
    // 게임의 결과에 따라 첫번째 유저와 두번째 유저가 얻거나 잃는 점수를 계산
    public int[] getEloPoint(int firstUserPt, int secondUserPt, double result) {

        int ratingDiff = secondUserPt - firstUserPt;

        double firstExpected = 1 / (1 + Math.pow(10, (ratingDiff / 800)));
        double secondExpected = 1 - firstExpected;

        int firstUpdatedPoint = (int) Math.floor(k * (result - firstExpected));
        int secondUpdatedPoint = (int) Math.floor(k * ((1 - result) - secondExpected));

        int[] ans = new int[2];
        ans[0] = firstUpdatedPoint;
        ans[1] = secondUpdatedPoint;

        return ans;

    }


}
