package com.example.chat_app.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "friendships")
@IdClass(Friendship.class)
public class Friendship {
    @Id private Long userId;
    @Id private Long friendId;

    private String status;

    private LocalDateTime createdAt;
}

class FriendshipId implements Serializable {
    private Long userId;
    private Long friendId;
}
