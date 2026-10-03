package com.example.chat_app.user.friendship.dto;

import com.example.chat_app.user.User;

/**
 * Public info only: never expose email / password / tokens.
 */
public record UserSummaryDto(Long id, String username) {
    public static UserSummaryDto from(User user) {
        return new UserSummaryDto(user.getId(), user.getUsername());
    }
}