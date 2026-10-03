package com.example.chat_app.user.friendship;


import com.example.chat_app.auth.JwtService;
import com.example.chat_app.user.friendship.dto.FriendshipRequestDto;
import com.example.chat_app.user.friendship.dto.PageResponse;
import com.example.chat_app.user.friendship.dto.SendFriendshipRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/friendship-requests")
@RequiredArgsConstructor
public class FriendshipRequestController {

    private final FriendshipRequestService requestService;
    private final JwtService jwtService;

    /**
     * Body: { "toUserId": 42 }
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FriendshipRequestDto send(@RequestBody SendFriendshipRequestDto body,
                                     HttpServletRequest request) {
        return requestService.send(jwtService.getUserIdFromRequest(request), body.toUserId());
    }

    /**
     * Pending requests I received.
     */
    @GetMapping("/incoming")
    public PageResponse<FriendshipRequestDto> incoming(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size,
                                                       HttpServletRequest request) {
        return requestService.getIncoming(jwtService.getUserIdFromRequest(request), page, size);
    }

    /**
     * Pending requests I sent.
     */
    @GetMapping("/outgoing")
    public PageResponse<FriendshipRequestDto> outgoing(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size,
                                                       HttpServletRequest request) {
        return requestService.getOutgoing(jwtService.getUserIdFromRequest(request), page, size);
    }

    /**
     * For a notification badge.
     */
    @GetMapping("/incoming/count")
    public Map<String, Long> incomingCount(HttpServletRequest request) {
        return Map.of("count", requestService.countIncoming(jwtService.getUserIdFromRequest(request)));
    }

    @PostMapping("/{id}/accept")
    public FriendshipRequestDto accept(@PathVariable Long id, HttpServletRequest request) {
        return requestService.accept(jwtService.getUserIdFromRequest(request), id);
    }

    @PostMapping("/{id}/decline")
    public FriendshipRequestDto decline(@PathVariable Long id, HttpServletRequest request) {
        return requestService.decline(jwtService.getUserIdFromRequest(request), id);
    }

    /**
     * Sender withdraws a pending request.
     */
    @DeleteMapping("/{id}")
    public FriendshipRequestDto cancel(@PathVariable Long id, HttpServletRequest request) {
        return requestService.cancel(jwtService.getUserIdFromRequest(request), id);
    }
}