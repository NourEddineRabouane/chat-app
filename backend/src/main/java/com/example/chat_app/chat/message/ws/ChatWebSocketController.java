package com.example.chat_app.chat.message.ws;

import com.example.chat_app.chat.message.dto.SendMessagePayload;
import com.example.chat_app.user.User;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatWebSocketController {


    @MessageMapping("/conversation/{conversationId}")
    public void handle(
            @DestinationVariable Long conversationId,
            @Payload SendMessagePayload payload,
            Principal principal
    ) {

        User u = (User) principal;

        messagingTemplate.convertAndSendToUser(
                otherUserId.toString(), "/queue/messages", savedMessageDto
        );
        messagingTemplate.convertAndSendToUser(
                u.getId(), "/queue/messages", savedMessageDto
        );
    }


//    @MessageMapping("/conversation/{conversationId}")
//    @SendTo("/topic/conversation/{conversationId}")
//    public String handle(
//            @DestinationVariable Long conversationId,
//            @Payload String message
//    ) {
//        return message;
//    }
}
