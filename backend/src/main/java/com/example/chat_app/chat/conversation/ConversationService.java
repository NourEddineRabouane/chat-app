package com.example.chat_app.chat.conversation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private  final ConversationRepository conversationRepository;

    List<Conversation> getUserConversations( Long userId){
        return conversationRepository.findAllForUser(userId);
    }
}
