package com.example.chat_app.user.dto;

public record UpdateUserProfileRequest(
        String username,
        String email
) {
}
