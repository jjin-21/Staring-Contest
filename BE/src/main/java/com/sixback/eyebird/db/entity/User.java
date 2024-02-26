package com.sixback.eyebird.db.entity;

import com.sixback.eyebird.api.dto.SearchUserResDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@NoArgsConstructor
@Table(name="users") // H2 데이터베이스에서는 User라는 테이블을 사용할 수 없으므로, 테이블의 이름을 Users로 변경한다.
@Getter

public class User extends BaseTime { // 생성시간과 수정시간을 다루기 위해, BaseTime을 extend한다
    @Id
    @GeneratedValue // TODO strategy는 어떻게?
    private Long id;

    @Column(length = 50, nullable = false, unique = true)
    private String email;

    // 해싱된 비밀번호
    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String nickname;


    @Column(nullable = false)
    private int profileImage;

    // PointEntity와 one to one mapping
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private Point point;

    @Column(columnDefinition = "boolean default false")
    private boolean ifDeleted;

    // 승리한 게임 결과들의 리스트
    @OneToMany(mappedBy = "userWinner", fetch = FetchType.LAZY)
    private List<GameResult> winGameResults;

    // 패배한 게임 결과들의 리스트
    @OneToMany(mappedBy = "userLoser", fetch = FetchType.LAZY)
    private List<GameResult> loseGameResults;

    @Builder
    public User(String email, String password, String nickname, int profileImage) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.profileImage = profileImage;
    }

    public void updateUser(String newHashedPassword, String newNickname, int newProfileImage) {
        this.password = newHashedPassword;
        this.nickname = newNickname;
        this.profileImage = newProfileImage;
    }

    public void updatePassword(String newHashedPassword) {
        this.password = newHashedPassword;
    }

    public void updateNickname(String newNickname) {
        this.nickname = newNickname;
    }

    public void updateProfileImage(int newProfileImage) {
        this.profileImage = newProfileImage;
    }

    public void deleteUser() {
        this.ifDeleted = true;
    }

//    public SearchUserResDto() {
//        SearchUserResDto searchUserResDto = SearchUserResDto.builder()
//                .email(this.getEmail())
//                .itemPt(this.getPoint().getItemPt())
//                .classicPt(this.getPoint().getClassicPt())
//                .
//    }

}
