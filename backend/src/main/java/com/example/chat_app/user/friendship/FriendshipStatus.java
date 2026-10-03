package com.example.chat_app.user.friendship;

public enum FriendshipStatus {
    PENDING,
    ACCEPTED,
    DECLINED,   // receiver said no
    CANCELED    // sender withdrew it
}