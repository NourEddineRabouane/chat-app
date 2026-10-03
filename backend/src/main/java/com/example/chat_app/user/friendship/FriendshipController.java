package com.example.chat_app.user.friendship;

import com.example.chat_app.auth.JwtService;
import com.example.chat_app.user.friendship.dto.FriendDto;
import com.example.chat_app.user.friendship.dto.PageResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;
    private final JwtService jwtService;

    @GetMapping
    public PageResponse<FriendDto> friends(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size,
                                           HttpServletRequest request) {
        return friendshipService.getFriends(jwtService.getUserIdFromRequest(request), page, size);
    }

    @GetMapping("/count")
    public Map<String, Long> count(HttpServletRequest request) {
        return Map.of("count", friendshipService.countFriends(jwtService.getUserIdFromRequest(request)));
    }

    @GetMapping("/{userId}/status")
    public Map<String, Boolean> status(@PathVariable Long userId, HttpServletRequest request) {
        return Map.of("friends",
                friendshipService.areFriends(jwtService.getUserIdFromRequest(request), userId));
    }

    @DeleteMapping("/{friendId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unfriend(@PathVariable Long friendId, HttpServletRequest request) {
        friendshipService.unfriend(jwtService.getUserIdFromRequest(request), friendId);
    }
}