package com.example.chat_app.user.friendship.dto;

import com.example.chat_app.user.friendship.Friendship;

import java.time.LocalDateTime;

public record FriendDto(UserSummaryDto user, LocalDateTime friendsSince) {
    public static FriendDto from(Friendship friendship, Long currentUserId) {
        return new FriendDto(
                UserSummaryDto.from(friendship.friendOf(currentUserId)),
                friendship.getCreatedAt());
    }
}