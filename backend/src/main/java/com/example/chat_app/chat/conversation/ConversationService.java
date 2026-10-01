package com.example.chat_app.chat.conversation;

import com.example.chat_app.chat.conversation.dto.ConversationMapper;
import com.example.chat_app.chat.conversation.dto.ConversationResponseDto;
import com.example.chat_app.chat.conversation.dto.CreateConversationDto;
import com.example.chat_app.chat.message.Message;
import com.example.chat_app.idgen.SnowflakeIdGenerator;
import com.example.chat_app.user.User;
import com.example.chat_app.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
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
    private final UserRepository userRepository;

    // Get conversation for a user using the user id
    @Transactional(readOnly = true)
    List<ConversationResponseDto> getUserConversations( Long userId){

        return conversationRepository.findAllForUser(userId)
                 .stream()
                 .map(ConversationMapper::mapConversationToResponseDto)
                 .toList();
    }

    // Create a conversation
    @Transactional
    public Conversation createConversation(CreateConversationDto dto) {
        Long id1 = dto.getMember1Id();
        Long id2 = dto.getMember2Id();

        if (id1.equals(id2)) {
            throw new IllegalArgumentException("Cannot create a conversation with yourself");
        }

        // 1 query, both users
        List<User> users = userRepository.findAllById(List.of(id1, id2));
        if (users.size() != 2) {
            throw new EntityNotFoundException("One or both users not found");
        }

        // Canonical ordering: smaller ID first
        User first  = users.get(0).getId() < users.get(1).getId() ? users.get(0) : users.get(1);
        User second = users.get(0).getId() < users.get(1).getId() ? users.get(1) : users.get(0);

        Conversation c = Conversation.builder()
                .id(idGenerator.generateId())
                .memberOne(first)
                .memberTwo(second)
                .build();

        return conversationRepository.save(c);
    }

    // Get a specific conversation by id
    @Transactional(readOnly = true)
    public ConversationResponseDto getConversation( Long conversationId){

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found!"));
        System.out.println(conversation.getId());
        return ConversationMapper.mapConversationToResponseDto(conversation);

    }

    // Get messages for a specific conversation
    public List<Message> getConversationMessages(Long conversationId){
        return conversationRepository.findAllMessagesForConversation(conversationId);
    }
}
