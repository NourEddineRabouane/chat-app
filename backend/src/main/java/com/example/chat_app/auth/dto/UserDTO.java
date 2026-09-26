package com.example.chat_app.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private LocalDateTime createdAt;
}
