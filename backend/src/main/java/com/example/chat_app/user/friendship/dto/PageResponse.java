package com.example.chat_app.user.friendship.dto;

import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

/**
 * Same shape the frontend already uses for messages: { data, currentPage, hasNext, totalItems }.
 */
public record PageResponse<T>(
        List<T> data,
        int currentPage,
        int totalPages,
        long totalItems,
        boolean hasNext
) {
    public static <S, T> PageResponse<T> from(Page<S> page, Function<S, T> mapper) {
        return new PageResponse<>(
                page.getContent().stream().map(mapper).toList(),
                page.getNumber(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.hasNext());
    }
}