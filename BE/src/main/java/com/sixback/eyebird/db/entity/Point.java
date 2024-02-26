package com.sixback.eyebird.db.entity;

import com.sixback.eyebird.api.dto.PointReqDto;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor // entity에서 기본 생성자가 필요
@Getter
public class Point extends BaseTime{
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private int classicPt;

    @Column(nullable = false)
    private int itemPt;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Builder
    public Point(int classicPt, int itemPt, User user) {
        this.classicPt = classicPt;
        this.itemPt = itemPt;
        this.user = user;
    }

    public void update(PointReqDto pointReqDto) {
        this.classicPt += pointReqDto.getClassicPt();
        this.itemPt += pointReqDto.getItemPt();
    }
}
