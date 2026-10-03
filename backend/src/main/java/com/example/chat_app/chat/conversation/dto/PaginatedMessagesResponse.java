package com.example.chat_app.chat.conversation.dto;

import com.example.chat_app.chat.message.Message;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class PaginatedMessagesResponse{
        private List<Message> data;
        private int currentPage;
        private int totalPages;
        private long totalItems;
        private int pageSize;
        private boolean hasNext;
        private boolean hasPrevious;
}
