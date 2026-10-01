package com.example.chat_app.chat.conversation;

import com.example.chat_app.auth.JwtService;
import com.example.chat_app.chat.conversation.dto.ConversationResponseDto;
import com.example.chat_app.chat.conversation.dto.CreateConversationDto;
import com.example.chat_app.chat.message.Message;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

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

    @PostMapping("/")
    public ResponseEntity<Conversation> createConversation(@RequestBody CreateConversationDto conversationDto) {

        Conversation conversation = conversationService.createConversation(conversationDto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(conversation.getId())
                .toUri();

        return ResponseEntity.created(location).body(conversation);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponseDto> getConversation(@PathVariable Long conversationId){
               ConversationResponseDto rd = conversationService.getConversation(conversationId);
        return ResponseEntity.ok(
                rd
        );

    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<List<Message>> getConversationMessages(@PathVariable Long conversationId){
        return ResponseEntity.ok(
                conversationService.getConversationMessages(conversationId)
        );
    }
}
