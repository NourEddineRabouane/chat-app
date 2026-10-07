package com.example.chat_app.presence;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class PresenceController {

    private final PresenceService presenceService;

    // full destination: /app/heartbeat. This is a separate, application-level heartbeat —
    // distinct from the STOMP protocol heartbeat frames configured in WebSocketConfig, which
    // only keep the TCP connection alive and aren't visible to application code at all.
    @MessageMapping("/heartbeat")
    public void heartbeat(Principal principal) {
        presenceService.markOnline(Long.valueOf(principal.getName()));
    }
}