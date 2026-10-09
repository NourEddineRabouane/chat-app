package com.example.chat_app.typing;


import com.example.chat_app.presence.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class TypingEventSubscriber {

    private final PresenceService presenceService; // For the isOnline method
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public void onMessage(String json) {
        try {
            // Transform the string to object
            TypingEvent event = objectMapper.readValue(json, TypingEvent.class);

            if (!presenceService.isOnline(event.toUserId())) {
                return;
            }
            
            // Redirect the event to the
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(event.toUserId()),
                    "/queue/typing",
                    event
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
