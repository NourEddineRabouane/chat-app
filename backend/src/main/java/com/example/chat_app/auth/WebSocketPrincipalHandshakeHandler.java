package com.example.chat_app.auth;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
public class WebSocketPrincipalHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected @Nullable Principal determineUser(@NonNull ServerHttpRequest request, @NonNull WebSocketHandler wsHandler, Map<String, Object> attributes) {
        Object userId = attributes.get("userId"); // set by JwtHandshakeInterceptor just before this run


        return () -> String.valueOf(userId);
    }
}
