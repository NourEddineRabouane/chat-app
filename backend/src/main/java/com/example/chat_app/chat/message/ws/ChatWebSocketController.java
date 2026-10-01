package com.example.chat_app.chat.message.ws;

import com.example.chat_app.chat.message.Message;
import com.example.chat_app.chat.message.MessageRepository;
import com.example.chat_app.chat.message.dto.SendMessagePayload;
import com.example.chat_app.idgen.SnowflakeIdGenerator;
import com.example.chat_app.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {
    private final MessageRepository messageRepository;
    private final SnowflakeIdGenerator idGenerator;
    private final SimpMessagingTemplate messagingTemplate;

    // For two members conversations
    @MessageMapping("/chat.privateMessage")
    public void handlePrivateMessaging(
            @Payload SendMessagePayload payload
    ) {

        Message message = Message.builder()
                .messageId(idGenerator.generateId())
                .senderId( payload.getSenderId())
                .conversationId(payload.getConversationId())
                .content(payload.getContent())
                .createdAt(Instant.ofEpochMilli(payload.getCreatedAt()).atZone(ZoneId.systemDefault()).toLocalDateTime())
                .build();

        System.out.println("sender: " + payload.getSenderId() +
                " | receiver: " + payload.getReceiverId() +
                " | content: " + payload.getContent() +
                " | at: " + payload.getCreatedAt());
        messageRepository.save(message);

        // Sends to topic /user/{recipientId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                String.valueOf(payload.getReceiverId()),
                "/queue/messages",
                message
        );

    }
}


//    @MessageMapping("/conversation/{conversationId}")
//    @SendTo("/topic/conversation/{conversationId}")
//    public String handle(
//            @DestinationVariable Long conversationId,
//            @Payload String message
//    ) {
//        return message;
//    }
