package com.example.chat_app.chat.message.dto;

import lombok.Getter;

@Getter
public class SendMessagePayload {
    Long conversationId;
    Long senderId;
    Long receiverId;
    String content;
    long createdAt;
}
