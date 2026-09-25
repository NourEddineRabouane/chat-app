package com.example.chat_app.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table( name = "users")
public class User {
    @Id
    private Long id;

    private String username;

    private String email;

    private String password;

    private Instant createdAt;
}
