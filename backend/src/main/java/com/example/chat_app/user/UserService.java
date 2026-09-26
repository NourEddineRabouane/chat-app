package com.example.chat_app.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserById( Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with this id: " + id + " was not found!"));
    }


}

