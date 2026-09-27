package com.example.chat_app.chat.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("""
        SELECT c FROM Conversation c
        WHERE c.memberOneId = :userId OR c.memberTwoId = :userId
        ORDER BY c.createdAt DESC
        """)
    List<Conversation> findAllForUser(@Param("userId") Long userId);

    // canonical pair lookup — used when starting/finding a 1-1 chat.
    // Caller must pass LEAST(a,b), GREATEST(a,b) — the CHECK constraint enforces this at insert time.
    Optional<Conversation> findByMemberOneIdAndMemberTwoId(Long memberOneId, Long memberTwoId);
}