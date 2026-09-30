package com.example.chat_app.auth;

import com.example.chat_app.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public class JwtService {

    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    private static final long ACCESS_TOKEN_TTL_MS = 1000L * 60 * 15; // 15 minutes

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("type", "access")
                .claim("email", user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_TTL_MS))
                .signWith(getSecretKey())
                .compact();
    }

    public Long getUserIdFromAccessToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String type = claims.get("type", String.class);
        if (type == null || !type.equals("access")) {
            throw new BadCredentialsException("Not an access token");
        }

        return Long.valueOf(claims.getSubject());
    }

    public String getTokenFromCookies(HttpServletRequest request, String tokenType){
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        Optional<String> token = Arrays.stream(cookies)
                .filter(c -> tokenType.equals(c.getName()))
                .map(Cookie::getValue)
                .filter(v -> v != null && !v.isBlank())
                .findFirst();

        return token.orElse(null);
    }

    public String getTokenFromHeader(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        String token = null;
        if ( authHeader != null && authHeader.startsWith("Bearer "))
            token = authHeader.substring(7);
        else
            throw new RuntimeException("No token was given");
        return token;
    }
}