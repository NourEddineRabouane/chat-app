package com.example.chat_app.chat.message;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "chat_group_message")
@IdClass(GroupMessageId.class)
public class GroupMessage {
    @Id private Long groupId;
    @Id private Long messageId;

    private Long userId;         // sender

    @Column(columnDefinition = "TEXT")
    private String content;

    private Instant createdAt;
}

// Composite key — needs equals()/hashCode() over both fields
class GroupMessageId implements Serializable {
    private Long groupId;
    private Long messageId;
}
