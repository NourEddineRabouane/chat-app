package com.example.chat_app.chat.conversation;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation { // Because the id is manually inserted and the save entity do not work
    @Id
    private Long id;              // assigned by SnowflakeIdGenerator

    private Long memberOneId;
    private Long memberTwoId;

    @Column(name = "created_at" , nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate(){
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return this.id + "; " + this.memberOneId + "; " + this.memberTwoId + "; " + this.createdAt;
    }
}