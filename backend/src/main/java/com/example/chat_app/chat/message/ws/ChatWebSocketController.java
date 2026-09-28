package com.example.chat_app.chat.message.ws;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    @MessageMapping("/conversation/{conversationId}")
    @SendTo("/topic/conversation/{conversationId}")
    public String handle(
            @DestinationVariable Long conversationId,
            @Payload String message
    ) {
        return message;
    }
}
