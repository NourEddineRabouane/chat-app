package com.example.chat_app.presence;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
public class PresenceEventSubscriber {
    private final FriendshipCacheService friendshipCacheService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;


    // invoked by the MessageListenerAdapter configured in RedisConfig — the method name
    public void onMessage(String json) {
        try {
            System.out.println("Sent prsence");

            PresenceEvent event = objectMapper.readValue(json, PresenceEvent.class);
            friendshipCacheService.getFriends(event.userId())
                    .forEach(friendId ->
                            messagingTemplate.convertAndSendToUser(
                                    String.valueOf(friendId), "/queue/presence", event
                            )
                    );

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
