package com.example.chat_app.typing;


import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class TypingService {

    private final String CHANNEL = "typing-events";

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;


    public void publish(TypingEvent event) {
        redisTemplate.convertAndSend(CHANNEL, objectMapper.writeValueAsString(event));
    }
}


