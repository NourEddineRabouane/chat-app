package com.example.chat_app.user.friendship;

import com.example.chat_app.user.User;
import com.example.chat_app.user.friendship.dto.FriendDto;
import com.example.chat_app.user.friendship.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendshipService {

    private static final int MAX_PAGE_SIZE = 50;

    private final FriendshipRepository friendshipRepository;

    public PageResponse<FriendDto> getFriends(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        return PageResponse.from(
                friendshipRepository.findAllByUserId(userId, pageable),
                friendship -> FriendDto.from(friendship, userId));
    }

    public long countFriends(Long userId) {
        return friendshipRepository.countByUserId(userId);
    }

    public boolean areFriends(Long userA, Long userB) {
        if (userA == null || userB == null || userA.equals(userB)) return false;
        return friendshipRepository.existsById(FriendshipId.of(userA, userB));
    }

    /**
     * Idempotent: calling it twice for the same pair creates one row.
     */
    @Transactional
    public void befriend(User a, User b) {
        FriendshipId id = FriendshipId.of(a.getId(), b.getId());
        if (!friendshipRepository.existsById(id)) {
            friendshipRepository.save(Friendship.between(a, b));
        }
    }

    @Transactional
    public void unfriend(Long currentUserId, Long friendId) {
        if (friendId == null || currentUserId.equals(friendId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid friend id");
        }
        FriendshipId id = FriendshipId.of(currentUserId, friendId);
        if (!friendshipRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "You are not friends with this user");
        }
        friendshipRepository.deleteById(id);
    }
}