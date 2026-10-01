package com.example.chat_app.chat.message;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "message")
@IdClass(Message.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @Id private Long messageId;
    @Id private Long conversationId;

    private Long senderId;

    @Column( columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;
}

class MessageId implements Serializable {
    private Long conversationId;
    private Long messageId;
}