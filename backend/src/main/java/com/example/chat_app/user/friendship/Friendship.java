package com.example.chat_app.user.friendship;

import com.example.chat_app.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "friendships",
        // the PK index already covers lookups by user_one_id; this one covers user_two_id
        indexes = @Index(name = "idx_friendships_user_two", columnList = "user_two_id"))

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Friendship {

    @EmbeddedId
    private FriendshipId id;

    @MapsId("userOneId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_one_id", nullable = false)
    private User userOne;

    @MapsId("userTwoId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_two_id", nullable = false)
    private User userTwo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    /**
     * Factory that guarantees the (smaller id, bigger id) ordering.
     */
    public static Friendship between(User a, User b) {
        FriendshipId key = FriendshipId.of(a.getId(), b.getId());
        boolean aFirst = a.getId().equals(key.getUserOneId());

        Friendship friendship = new Friendship();
        friendship.id = key;
        friendship.userOne = aFirst ? a : b;
        friendship.userTwo = aFirst ? b : a;
        return friendship;
    }

    /**
     * The other person in this friendship, from {@code userId}'s point of view.
     */
    public User friendOf(Long userId) {
        return id.getUserOneId().equals(userId) ? userTwo : userOne;
    }
}