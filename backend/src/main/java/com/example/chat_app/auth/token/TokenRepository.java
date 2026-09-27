package com.example.chat_app.auth.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByTokenHash(String tokenHash);

    @Modifying
    @Query("update Token t set t.revoked = true where t.user.id = :userId")
    void revokeAllForUser(@Param("userId") Long userId);
}