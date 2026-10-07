package com.example.chat_app.presence;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PresenceSessionListener {
    private final PresenceService presenceService;

    // When the user is connected we mark him as online and offline when he disconnects

    @EventListener
    public void onConnected(SessionConnectedEvent event) {
        userIdOf(event.getMessage()).ifPresent(presenceService::markOnline);
    }


    @EventListener
    public void onDisconnected(SessionDisconnectEvent event) {
        userIdOf(event.getMessage()).ifPresent(presenceService::markOffline);
    }


    private Optional<Long> userIdOf(Message<byte[]> message) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        Principal principal = accessor.getUser();

        return principal == null ?
                Optional.empty() :
                Optional.of(Long.valueOf(principal.getName()));
    }
}
