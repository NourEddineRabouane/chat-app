package com.example.chat_app.chat.message;

import jakarta.persistence.*;
import lombok.*;
import tools.jackson.databind.annotation.JsonSerialize;
import tools.jackson.databind.ser.std.ToStringSerializer;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "message")
@IdClass(MessageId.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private Long messageId;

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private Long conversationId;

    private Long senderId;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;
}

class MessageId implements Serializable {
    private Long conversationId;
    private Long messageId;
}