package com.example.chat_app.auth;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;


    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        // sockets are available in the first WS request which is an HTTP request
        if (!(request instanceof ServletServerHttpRequest servletRequest)){
            return false;
        }

        HttpServletRequest httpRequest = servletRequest.getServletRequest();

        String token = jwtService.getTokenFromCookies(httpRequest, "accessToken");
        if ( token == null){
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        try {
            Long userId = jwtService.getUserIdFromAccessToken(token);
            // stashed here so WebSocketPrincipalHandshakeHandler can read it right after
            // this map is the only channel HandshakeInterceptor has to pass data forward
            attributes.put("userId" , userId);
            return true;
        } catch (Exception e){
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false; // expired or tampered token
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // no-op — nothing to clean up on the HTTP side once the socket is open
    }

}
