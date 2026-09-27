package com.example.chat_app.chat.message;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "message")
@IdClass(Message.class)
@Getter
@Setter
public class Message {
    @Id private Long messageId;
    @Id private Long conversationId;

    private Long senderId;

    @Column( columnDefinition = "TEXT")
    private String content;

    private Instant createdAt;
}

class MessageId implements Serializable {
    private Long conversationId;
    private Long messageId;
}