package com.example.chat_app.chat.conversation;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "conversations")
public class Conversation {
    @Id
    private Long id;              // assigned by SnowflakeIdGenerator

    private Long memberOneId;
    private Long memberTwoId;
    private Instant createdAt;
}