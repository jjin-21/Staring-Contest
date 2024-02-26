package com.sixback.eyebird.util;

import javax.swing.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/** String to Hash
 * Sha256Convert의 instance를 받아서
 * ShaEncoder 사용할것
 */
public class Sha256Convert {
// 싱글톤으로 instance 생성
    static Sha256Convert instance = new Sha256Convert();

    private Sha256Convert(){
    }

    public static Sha256Convert getInstance(){
        return instance;
    }

    // 1. 메시지 다이제스트를 문자열로 return
    public static String ShaEncoder(String userPw) {
        try {
            // 알고리즘을 "SHA-256"으로 하여 MessageDigest 객체 생성
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // 해시된 데이터는 바이트 배열의 바이너리 데이터이다.
            byte[] hash = digest.digest(userPw.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            // 바이트 배열을 16진수(hex) 문자열로 변환
            for (byte b : hash) {	//hash에서 데이터를 꺼내 b에 담는다.
                //byte 8비트 ->int 32bit 형변환 시 앞의 18비트가 19번째 비트와 같은 값으로 채우는데
                //이 경우에 원본 값과 다른 경우가 되는 것을 방지하기 위한 연산이다.
                String hex = Integer.toHexString(0xff & b);

                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
