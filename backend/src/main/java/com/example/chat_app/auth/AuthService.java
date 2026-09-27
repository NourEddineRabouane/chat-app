package com.example.chat_app.auth;

import com.example.chat_app.auth.dto.LoginDTO;
import com.example.chat_app.auth.dto.SignUpDTO;
import com.example.chat_app.auth.dto.UserDTO;
import com.example.chat_app.auth.mapper.ModelMapper;
import com.example.chat_app.auth.token.Token;
import com.example.chat_app.auth.token.TokenGenerator;
import com.example.chat_app.auth.token.TokenRepository;
import com.example.chat_app.user.User;
import com.example.chat_app.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private static final long REFRESH_TOKEN_TTL_DAYS = 30;

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    // Signup --- create the user depends on the giving credentials
    public UserDTO signUp(SignUpDTO signUpDTO) {
        userRepository.findByEmail(signUpDTO.getEmail())
                .ifPresent(u -> { throw new BadCredentialsException("Email already exists"); });

        User toBeCreatedUser = modelMapper.mapSignupDtoTouser(signUpDTO);
        toBeCreatedUser.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));

        User savedUser = userRepository.save(toBeCreatedUser);
        return modelMapper.mapUsertoUserdto(savedUser);
    }

    // Login --- login the user and generate the appropriate tokens
    public Map<String, Object> login(LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword());

        Authentication authentication = authenticationManager.authenticate(authToken);
        MyUserDetails myUserDetails = (MyUserDetails) authentication.getPrincipal();
        User user = myUserDetails.getUser();

        return issueTokens(user);
    }

    //---------------------------Refresh------------------------
    @Transactional
    public Map<String, Object> refreshToken(String rawRefreshToken) {
        String hash = TokenGenerator.hash(rawRefreshToken);

        Token existing = tokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        if (existing.isRevoked()) {
            // This token was already rotated away — someone is replaying an old one.
            // Treat the whole session as compromised.
            tokenRepository.revokeAllForUser(existing.getUser().getId());
            throw new BadCredentialsException("Refresh token reuse detected");
        }

        if (existing.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadCredentialsException("Refresh token expired");
        }

        existing.setRevoked(true);
        tokenRepository.save(existing);

        return issueTokens(existing.getUser());
    }

    //---------------------------Logout------------------------
    public void revokeRefreshToken(String rawRefreshToken) {
        tokenRepository.findByTokenHash(TokenGenerator.hash(rawRefreshToken))
                .ifPresent(t -> { t.setRevoked(true); tokenRepository.save(t); });
    }

    // ------------------------------------------------------------------

    private Map<String, Object> issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);

        String rawRefreshToken = TokenGenerator.generateOpaqueToken();
        Token token = new Token();
        token.setUser(user);
        token.setTokenHash(TokenGenerator.hash(rawRefreshToken));
        token.setExpiresAt(LocalDateTime.now().plusDays(REFRESH_TOKEN_TTL_DAYS));
        tokenRepository.save(token);

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", rawRefreshToken,
                "user", modelMapper.mapUsertoUserdto(user)
        );
    }
}