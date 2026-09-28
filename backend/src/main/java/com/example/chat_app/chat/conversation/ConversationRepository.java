package com.example.chat_app.chat.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // Save conversation method
    @Modifying
    @Query(value = """
        INSERT INTO conversations (id, member_one_id, member_two_id, created_at)
        VALUES (:id, :m1Id, :m2Id, now())
        """, nativeQuery = true)
    void insertConversation(@Param("id") Long id,
                           @Param("m1Id") Long m1Id,
                           @Param("m2Id") Long m2Id);

    @Query("""
        SELECT c FROM Conversation c
        WHERE c.memberOneId = :userId OR c.memberTwoId = :userId
        ORDER BY c.createdAt DESC
        """)
    List<Conversation> findAllForUser(@Param("userId") Long userId);


    default List<Conversation> findAllForUserDebug(Long userId) {
        System.out.println("REPO userId: " + userId + " (type " + userId.getClass() + ")");
        return findAllForUser(userId);
    }

    // canonical pair lookup — used when starting/finding a 1-1 chat.
    // Caller must pass LEAST(a,b), GREATEST(a,b) — the CHECK constraint enforces this at insert time.
    Optional<Conversation> findByMemberOneIdAndMemberTwoId(Long memberOneId, Long memberTwoId);
}