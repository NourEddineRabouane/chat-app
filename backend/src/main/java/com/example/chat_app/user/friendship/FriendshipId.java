package com.example.chat_app.user.friendship;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Getter
@EqualsAndHashCode
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class FriendshipId implements Serializable {

    @Column(name = "user_one_id", nullable = false)
    private Long userOneId;

    @Column(name = "user_two_id", nullable = false)
    private Long userTwoId;

    public static FriendshipId of(Long a, Long b) {
        if (a == null || b == null) throw new IllegalArgumentException("User ids are required");
        if (a.equals(b)) throw new IllegalArgumentException("A user cannot befriend themselves");
        return a < b ? new FriendshipId(a, b) : new FriendshipId(b, a);
    }
}