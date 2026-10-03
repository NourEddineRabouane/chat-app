package com.example.chat_app.user.friendship.dto;

import com.example.chat_app.user.friendship.FriendshipRequest;
import com.example.chat_app.user.friendship.FriendshipStatus;

import java.time.LocalDateTime;

public record FriendshipRequestDto(
        Long id,
        UserSummaryDto fromUser,
        UserSummaryDto toUser,
        FriendshipStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static FriendshipRequestDto from(FriendshipRequest r) {
        return new FriendshipRequestDto(
                r.getId(),
                UserSummaryDto.from(r.getFromUser()),
                UserSummaryDto.from(r.getToUser()),
                r.getStatus(),
                r.getCreatedAt(),
                r.getUpdatedAt());
    }
}