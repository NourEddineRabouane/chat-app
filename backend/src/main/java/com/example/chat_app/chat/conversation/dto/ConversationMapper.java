package com.example.chat_app.chat.conversation.dto;

import com.example.chat_app.chat.conversation.Conversation;
import com.example.chat_app.user.User;

import java.util.Objects;


public class ConversationMapper {

    public static ConversationResponseDto  mapConversationToResponseDto(Conversation conversation ){
        User one = conversation.getMemberOne();
        User two = conversation.getMemberTwo();

        return new ConversationResponseDto(
                conversation.getId(),
                conversation.getCreatedAt(),
                new UserSummary(
                        one.getId(),
                        one.getUsername(),
                        one.getEmail()
                ),
                new UserSummary(
                        two.getId(),
                        two.getUsername(),
                        two.getEmail()
                )
        );
    }
}
