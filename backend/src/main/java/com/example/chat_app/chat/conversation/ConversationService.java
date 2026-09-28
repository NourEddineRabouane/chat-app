package com.example.chat_app.chat.conversation;

import com.example.chat_app.chat.conversation.dto.CreateConversationDto;
import com.example.chat_app.idgen.SnowflakeIdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final SnowflakeIdGenerator idGenerator;

    // Get conversation for a user using the user id
    @Transactional(readOnly = true)
    List<Conversation> getUserConversations( Long userId){
        List<Conversation> result = conversationRepository.findAllForUser(userId);
        System.out.println("REPO returned " + result.size() + " rows: " + result);
        return result;
    }

    // Create a conversation
    @Transactional
    public Conversation createConversation(CreateConversationDto dto) {
        Long a = dto.getMember1Id(), b = dto.getMember2Id();
        Long one = Math.min(a, b), two = Math.max(a, b);

        Conversation c = Conversation.builder()
                .id(idGenerator.generateId())
                .memberOneId(one)
                .memberTwoId(two)
                .build();

        conversationRepository.insertConversation(c.getId(), one, two);
        c.setCreatedAt(LocalDateTime.now());
        return c;
    }

    // Get a specific conversation by id
    public Conversation getConversation( Long conversationId){
        return conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found!"));
    }
}
