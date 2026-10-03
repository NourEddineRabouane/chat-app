package com.example.chat_app.chat.conversation;

import com.example.chat_app.chat.message.Message;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("""
        SELECT c 
        FROM Conversation c
        WHERE c.id = :conversationId
                """)
    @Override
    Optional<Conversation> findById(@Param("conversationId") @NonNull Long conversationId);


    @Query("""
        SELECT c FROM Conversation c
        WHERE c.memberOne.id = :userId OR c.memberTwo.id = :userId
        ORDER BY c.createdAt DESC
        """)
    List<Conversation> findAllForUser(@Param("userId") Long userId);

    // canonical pair lookup — used when starting/finding a 1-1 chat.
    // Caller must pass LEAST(a,b), GREATEST(a,b) — the CHECK constraint enforces this at insert time.
    Optional<Conversation> findByMemberOneIdAndMemberTwoId(Long memberOneId, Long memberTwoId);

    // Get Messages for a conversation
    @Query("""
        SELECT m FROM Message m
        WHERE m.conversationId = :conversationId
        ORDER BY m.messageId DESC
    """)
    public Page<Message> findAllMessagesForConversation(@Param("conversationId") Long conversationId, Pageable pageable);
}