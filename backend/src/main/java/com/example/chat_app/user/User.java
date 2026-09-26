package com.example.chat_app.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


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


    @PrePersist
    protected  void onCreate(){
        this.createdAt = LocalDateTime.now();
    }
}
