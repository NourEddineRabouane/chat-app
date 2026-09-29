package com.example.chat_app.auth;

import com.example.chat_app.auth.dto.LoginDTO;
import com.example.chat_app.auth.dto.SignUpDTO;
import com.example.chat_app.auth.dto.UserDTO;
import com.example.chat_app.user.User;
import com.example.chat_app.user.dto.UserResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    private static final String ACCESS_COOKIE = "accessToken";
    private static final String REFRESH_COOKIE = "refreshToken";
    // Scope the refresh cookie so the browser only ever sends it to the refresh
    // endpoint — adjust this if you change server.servlet.context-path.
    private static final String REFRESH_COOKIE_PATH = "/auth/refresh";

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@RequestBody SignUpDTO signUpDTO) {
        return ResponseEntity.ok(authService.signUp(signUpDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        Map<String, Object> result = authService.login(loginDTO);
        return respondWithTokens(result, response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserDTO> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = readCookie(request, REFRESH_COOKIE)
                .orElseThrow(() -> new BadCredentialsException("Refresh token missing"));

        Map<String, Object> result = authService.refreshToken(refreshToken);
        return respondWithTokens(result, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        readCookie(request, REFRESH_COOKIE).ifPresent(authService::revokeRefreshToken);

        clearCookie(response, ACCESS_COOKIE, "/");
        clearCookie(response, REFRESH_COOKIE, REFRESH_COOKIE_PATH);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request){
        String accessToken = readCookie(request, ACCESS_COOKIE)
                .orElseThrow( () -> new BadCredentialsException("Access token missing"));
        User u = authService.getCurrentUser(accessToken);

        return ResponseEntity.ok(
                new UserResponseDto(
                        u.getId(),
                        u.getEmail(),
                        u.getUsername()
                )
        );

    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(401).body(ex.getMessage());
    }

    // Some helper methods for response entities
    private ResponseEntity<UserDTO> respondWithTokens(Map<String, Object> result, HttpServletResponse response) {
        setCookie(response, ACCESS_COOKIE, (String) result.get("accessToken"), "/", Duration.ofMinutes(15));
        setCookie(response, REFRESH_COOKIE, (String) result.get("refreshToken"), REFRESH_COOKIE_PATH, Duration.ofDays(30));
        return ResponseEntity.ok((UserDTO) result.get("user"));
    }

    private Optional<String> readCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return Optional.empty();
        return Arrays.stream(request.getCookies())
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

    // Handle Cookies
    private void setCookie(HttpServletResponse response, String name, String value, String path, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true) // only set false for local http-only dev
                .sameSite("Lax")
                .path(path)
                .maxAge(maxAge)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearCookie(HttpServletResponse response, String name, String path) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .httpOnly(true).secure(true).sameSite("Lax").path(path).maxAge(0).build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}