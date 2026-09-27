package com.example.chat_app.user;

import com.example.chat_app.auth.token.Token;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table( name = "users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String email;

    private String password;

    @JsonFormat(pattern = "dd/MM/yyyy hh:mm")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user")
    private List<Token> refreshTokens;

    @PrePersist
    protected  void onCreate(){
        this.createdAt = LocalDateTime.now();
    }
}
