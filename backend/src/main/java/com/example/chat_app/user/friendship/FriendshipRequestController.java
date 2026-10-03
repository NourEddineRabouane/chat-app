package com.example.chat_app.user.friendship;


import com.example.chat_app.user.UserService;
import com.example.chat_app.user.friendship.dto.FriendshipRequestDto;
import com.example.chat_app.user.friendship.dto.PageResponse;
import com.example.chat_app.user.friendship.dto.SendFriendshipRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/friendship-requests")
@RequiredArgsConstructor
public class FriendshipRequestController {

    private final FriendshipRequestService requestService;
    private final UserService currentUser;

    /**
     * Body: { "toUserId": 42 }
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FriendshipRequestDto send(@RequestBody SendFriendshipRequestDto body,
                                     Authentication authentication) {
        return requestService.send(currentUser.currentUserId(authentication), body.toUserId());
    }

    /**
     * Pending requests I received.
     */
    @GetMapping("/incoming")
    public PageResponse<FriendshipRequestDto> incoming(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size,
                                                       Authentication authentication) {
        return requestService.getIncoming(currentUser.currentUserId(authentication), page, size);
    }

    /**
     * Pending requests I sent.
     */
    @GetMapping("/outgoing")
    public PageResponse<FriendshipRequestDto> outgoing(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size,
                                                       Authentication authentication) {
        return requestService.getOutgoing(currentUser.currentUserId(authentication), page, size);
    }

    /**
     * For a notification badge.
     */
    @GetMapping("/incoming/count")
    public Map<String, Long> incomingCount(Authentication authentication) {
        return Map.of("count", requestService.countIncoming(currentUser.currentUserId(authentication)));
    }

    @PostMapping("/{id}/accept")
    public FriendshipRequestDto accept(@PathVariable Long id, Authentication authentication) {
        return requestService.accept(currentUser.currentUserId(authentication), id);
    }

    @PostMapping("/{id}/decline")
    public FriendshipRequestDto decline(@PathVariable Long id, Authentication authentication) {
        return requestService.decline(currentUser.currentUserId(authentication), id);
    }

    /**
     * Sender withdraws a pending request.
     */
    @DeleteMapping("/{id}")
    public FriendshipRequestDto cancel(@PathVariable Long id, Authentication authentication) {
        return requestService.cancel(currentUser.currentUserId(authentication), id);
    }
}