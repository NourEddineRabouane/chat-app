package com.example.chat_app.chat.conversation;

import com.example.chat_app.auth.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {
    private final ConversationService conversationService;
    private final JwtService jwtService;

    @GetMapping("/me")
    public ResponseEntity<?> getUserConversations(HttpServletRequest request){
        String token = jwtService.getTokenFromCookies(request, "accessToken");
        Long userId = jwtService.getUserIdFromAccessToken(token);

        return ResponseEntity.ok(conversationService.getUserConversations(userId));
    }
}
