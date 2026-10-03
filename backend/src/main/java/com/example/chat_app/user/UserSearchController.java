package com.example.chat_app.user;

import com.example.chat_app.auth.JwtService;
import com.example.chat_app.user.friendship.dto.UserSummaryDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Lets the "Add friend" tab find people by username. Returns id + username only.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserSearchController {

    private static final int MIN_LENGTH = 2;

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @GetMapping("/search")
    public List<UserSummaryDto> search(@RequestParam("q") String q, HttpServletRequest request) {
        String term = q.trim();
        if (term.length() < MIN_LENGTH) return List.of();

        Long me = jwtService.getUserIdFromRequest(request);


        return userRepository
                .findTop10ByUsernameContainingIgnoreCaseAndIdNot(term, me)
                .stream()
                .map(UserSummaryDto::from)
                .toList();
    }
}