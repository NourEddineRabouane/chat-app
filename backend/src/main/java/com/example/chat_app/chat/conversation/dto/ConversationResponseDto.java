package com.example.chat_app.chat.conversation.dto;

import lombok.Setter;

import java.time.Instant;

@Setter
public class ConversationResponseDto {
    private Long id;
    private Long memberOneId;
    private Long memberTwoId;
    private Instant createdAt;
}
