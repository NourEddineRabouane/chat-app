package com.example.chat_app.chat.message;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(
        name = "message",
        indexes = {
                @Index( name = "idx_from_to", columnList = ("messageFrom, messageTo, messageId")),
                @Index( name = "idx_to_from", columnList = ("messageTo, messageFrom, messageId"))
        }
)
public class Message {
    @Id
    @Column(name = "message_id")
    private Long id;

    private Long messageFrom;
    private Long messageTo;

    @Column( columnDefinition = "TEXT")
    private String content;

    private Instant createdAt;
}
