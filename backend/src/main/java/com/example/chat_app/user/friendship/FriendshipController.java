package com.example.chat_app.user.friendship;

import com.example.chat_app.user.UserService;
import com.example.chat_app.user.friendship.dto.FriendDto;
import com.example.chat_app.user.friendship.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;
    private final UserService currentUser;

    @GetMapping
    public PageResponse<FriendDto> friends(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size,
                                           Authentication authentication) {
        return friendshipService.getFriends(currentUser.currentUserId(authentication), page, size);
    }

    @GetMapping("/count")
    public Map<String, Long> count(Authentication authentication) {
        return Map.of("count", friendshipService.countFriends(currentUser.currentUserId(authentication)));
    }

    @GetMapping("/{userId}/status")
    public Map<String, Boolean> status(@PathVariable Long userId, Authentication authentication) {
        return Map.of("friends",
                friendshipService.areFriends(currentUser.currentUserId(authentication), userId));
    }

    @DeleteMapping("/{friendId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unfriend(@PathVariable Long friendId, Authentication authentication) {
        friendshipService.unfriend(currentUser.currentUserId(authentication), friendId);
    }
}