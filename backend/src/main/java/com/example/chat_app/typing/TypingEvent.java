package com.example.chat_app.typing;

public record TypingEvent(
        Long fromUserId,
        Long toUserId,
        Long conversationId,
        String status
) {
}
