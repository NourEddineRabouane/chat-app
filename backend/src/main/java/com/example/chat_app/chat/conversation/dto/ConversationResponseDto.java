package com.example.chat_app.chat.conversation.dto;


import java.time.LocalDateTime;

public record ConversationResponseDto(
        String id,
        LocalDateTime createdAt,
        UserSummary firstUser,
        UserSummary secondUser

) {
}

record UserSummary(
        Long id,
        String username,
        String email
) {

}