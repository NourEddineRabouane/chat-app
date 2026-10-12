package com.example.chat_app.user;

import com.example.chat_app.user.dto.UpdateUserProfileRequest;
import com.example.chat_app.user.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentProfile(authentication));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMe(Authentication authentication,
                                                        @RequestBody UpdateUserProfileRequest request) {
        return ResponseEntity.ok(userService.updateCurrentProfile(authentication, request));
    }
}