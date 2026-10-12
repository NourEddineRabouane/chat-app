package com.example.chat_app.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.util.StringUtils;

import com.example.chat_app.user.dto.UpdateUserProfileRequest;
import com.example.chat_app.user.dto.UserProfileResponse;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public Long currentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        try {
            return Long.valueOf(authentication.getName());
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentProfile(Authentication authentication) {
        return toProfileResponse(getUserById(currentUserId(authentication)));
    }

    @Transactional
    public UserProfileResponse updateCurrentProfile(Authentication authentication, UpdateUserProfileRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Profile data is required");
        }
        Long userId = currentUserId(authentication);
        User user = getUserById(userId);

        boolean updated = false;

        if (request.username() != null) {
            String username = request.username().trim();
            if (!StringUtils.hasText(username)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username cannot be blank");
            }
            if (!username.equals(user.getUsername())) {
                ensureUsernameAvailable(username, userId);
                user.setUsername(username);
                updated = true;
            }
        }

        if (request.email() != null) {
            String email = request.email().trim();
            if (!StringUtils.hasText(email)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email cannot be blank");
            }
            if (!email.equals(user.getEmail())) {
                ensureEmailAvailable(email, userId);
                user.setEmail(email);
                updated = true;
            }
        }

        if (!updated) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No profile fields provided");
        }

        return toProfileResponse(userRepository.save(user));
    }

    private void ensureEmailAvailable(String email, Long currentUserId) {
        userRepository.findByEmail(email)
                .filter(existing -> !existing.getId().equals(currentUserId))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
                });
    }

    private void ensureUsernameAvailable(String username, Long currentUserId) {
        userRepository.findByUsername(username)
                .filter(existing -> !existing.getId().equals(currentUserId))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
                });
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getCreatedAt()
        );
    }
}
