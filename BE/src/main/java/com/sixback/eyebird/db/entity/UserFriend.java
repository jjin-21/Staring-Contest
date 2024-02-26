package com.sixback.eyebird.db.entity;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Table(name = "user_friend")
@Getter
@Setter
public class UserFriend extends BaseTime {
    @Id
    @GeneratedValue
    private Long id;

    // user id를 가져야한다.
    @ManyToOne
    @JoinColumn(name = "user_from_id")
    private User userFrom;

    @ManyToOne
    @JoinColumn(name = "user_to_id")
    private User userTo;

    @Override
    public String toString() {
        return "UserFriend{" +
                "id=" + id +
                ", userFrom=" + userFrom +
                ", userTo=" + userTo +
                '}';
    }
}
