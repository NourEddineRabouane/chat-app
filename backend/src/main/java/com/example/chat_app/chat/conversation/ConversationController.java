package com.example.chat_app.chat.conversation;

import com.example.chat_app.auth.JwtService;
import com.example.chat_app.chat.conversation.dto.ConversationMapper;
import com.example.chat_app.chat.conversation.dto.ConversationResponseDto;
import com.example.chat_app.chat.conversation.dto.CreateConversationDto;
import com.example.chat_app.chat.conversation.dto.PaginatedMessagesResponse;
import com.example.chat_app.chat.message.Message;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<?> getUserConversations(HttpServletRequest request) {
        String token = jwtService.getTokenFromCookies(request, "accessToken");
        Long userId = jwtService.getUserIdFromAccessToken(token);

        return ResponseEntity.ok(conversationService.getUserConversations(userId));
    }

    @PostMapping
    public ResponseEntity<ConversationResponseDto> createConversation(@RequestBody CreateConversationDto conversationDto,
                                                                      Authentication principal) {

        Long currentUserId = Long.valueOf(principal.getName());
        ConversationResponseDto conversation = conversationService.createConversation(conversationDto.withMemberId(), currentUserId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(conversation.id())
                .toUri();

        return ResponseEntity.created(location).body(conversation);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponseDto> getConversation(@PathVariable Long conversationId) {
        ConversationResponseDto rd = conversationService.getConversation(conversationId);
        return ResponseEntity.ok(
                rd
        );

    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<PaginatedMessagesResponse> getConversationMessages(@PathVariable Long conversationId,
                                                                             @PageableDefault(page = 0, size = 20) Pageable pageable
    ) {
        // Frontend sends 1-based; Spring Data is 0-based.
        int zeroBasedPage = Math.max(pageable.getPageNumber() - 1, 0);
        Pageable adjusted = PageRequest.of(zeroBasedPage, pageable.getPageSize(), pageable.getSort());

        PaginatedMessagesResponse response = buildPaginatedResponse(conversationService.getConversationMessages(conversationId, adjusted));
        return ResponseEntity.ok(response);
    }


    private PaginatedMessagesResponse buildPaginatedResponse(Page<Message> page) {

        return PaginatedMessagesResponse.builder()
                .data(page.getContent())
                .currentPage(page.getNumber() + 1)
                .totalPages(page.getTotalPages())
                .totalItems(page.getTotalElements())
                .pageSize(page.getSize())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}
