package com.example.chat_app.auth.mapper;

import com.example.chat_app.auth.dto.SignUpDTO;
import com.example.chat_app.auth.dto.UserDTO;
import com.example.chat_app.user.User;
import org.springframework.stereotype.Component;

@Component
public class ModelMapper {
    public User mapSignupDtoTouser(SignUpDTO signdto ){
        User u = new User();
        u.setEmail(signdto.getEmail());
        u.setUsername(signdto.getUsername());
        return u;

    }

    public UserDTO mapUsertoUserdto(User u){
        return UserDTO.builder()
                .id( u.getId())
                .email(u.getEmail())
                .username(u.getUsername())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
