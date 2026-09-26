package com.example.chat_app.auth;

import com.example.chat_app.auth.dto.LoginDTO;
import com.example.chat_app.auth.dto.SignUpDTO;
import com.example.chat_app.auth.dto.UserDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    //---------------------------SignUp------------------------
    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@RequestBody SignUpDTO signUpDTO) {
        UserDTO userDTO = authService.signUp(signUpDTO);
        return ResponseEntity.ok(userDTO);
    }

    //---------------------------Login------------------------
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        String token = authService.login(loginDTO);

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true); // JavaScript cannot read this cookie
        response.addCookie(cookie);

        return ResponseEntity.ok(token);
    }
}