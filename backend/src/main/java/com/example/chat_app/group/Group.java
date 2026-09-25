package com.example.chat_app.group;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "chat_group")
public class Group {
    @Id
    private Long groupId;

    private String name;

    private Long createdBy;

    private Instant createdAt;
}
