package com.example.chat_app.presence;

import com.example.chat_app.user.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@RestController
@RequestMapping("/api/presence")
@RequiredArgsConstructor
public class PresenceRestController {
    private final PresenceService presenceService;
    private final FriendshipCacheService friendshipCacheService;

    @GetMapping("/friends")
    public Set<Long> onlineFriends(Authentication auth) {
        System.out.println("Here ++++++++++ " + auth.getName());
        if (auth == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        Long me = Long.valueOf(auth.getName());
        Set<Long> online = presenceService.filterOnline(friendshipCacheService.getFriends(me));
        System.out.println("presence/friends me= " + me + "  online=" + online);
        return online;
    }
}
