package com.example.chat_app.typing;


import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class TypingController {
    private final TypingService typingService;


    @MessageMapping("/typing")
    public void typing(@Payload TypingEvent incoming, Principal principal) {
        if (principal == null) return;

        if (incoming.toUserId() == null || incoming.conversationId() == null) return;

        Long fromUserId = Long.valueOf(principal.getName()); // Current user

        TypingEvent event = new TypingEvent(
                fromUserId,
                incoming.toUserId(),
                incoming.conversationId(),
                incoming.status() != null ? incoming.status() : "TYPING"
        );

        typingService.publish(event);


    }
}
