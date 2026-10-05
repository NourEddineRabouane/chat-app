package com.example.chat_app.user.friendship;

import com.example.chat_app.user.User;
import com.example.chat_app.user.UserRepository;
import com.example.chat_app.user.friendship.dto.FriendshipRequestDto;
import com.example.chat_app.user.friendship.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendshipRequestService {

    private static final int MAX_PAGE_SIZE = 50;

    private final FriendshipRequestRepository requestRepository;
    private final FriendshipService friendshipService;
    private final UserRepository userRepository;

    // ------------------------------------------------------------------ send

    @Transactional
    public FriendshipRequestDto send(Long senderId, Long receiverId) {
        if (receiverId == null) throw badRequest("toUserId is required");
        if (senderId.equals(receiverId)) throw badRequest("You cannot send a friend request to yourself");

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> notFound("User not found"));
        User sender = userRepository.getReferenceById(senderId);

        if (friendshipService.areFriends(senderId, receiverId)) {
            throw conflict("You are already friends");
        }

        // They already asked me -> sending one back just accepts theirs.
        Optional<FriendshipRequest> reverse =
                requestRepository.findByFromUserIdAndToUserId(receiverId, senderId);
        if (reverse.isPresent() && reverse.get().isPending()) {
            FriendshipRequest incoming = reverse.get();
            incoming.accept();
            friendshipService.befriend(sender, receiver);
            return FriendshipRequestDto.from(incoming);
        }

        // Reuse my previous request to them (declined / canceled / old) or create one.
        FriendshipRequest request = requestRepository
                .findByFromUserIdAndToUserId(senderId, receiverId)
                .map(existing -> {
                    if (existing.isPending()) throw conflict("Friend request already sent");
                    existing.reopen();
                    return existing;
                })
                .orElseGet(() -> FriendshipRequest.builder()
                        .fromUser(sender)
                        .toUser(receiver)
                        .build());

        try {
            request = requestRepository.saveAndFlush(request);
        } catch (DataIntegrityViolationException e) {
            // two simultaneous sends: the unique constraint caught the second one
            throw conflict("Friend request already sent");
        }
        return FriendshipRequestDto.from(request);
    }

    // ------------------------------------------------------- respond / cancel

    @Transactional
    public FriendshipRequestDto accept(Long currentUserId, Long requestId) {
        FriendshipRequest request = loadPending(requestId, currentUserId, true);
        request.accept();
        friendshipService.befriend(request.getFromUser(), request.getToUser());
        return FriendshipRequestDto.from(request);
    }

    @Transactional
    public FriendshipRequestDto decline(Long currentUserId, Long requestId) {
        FriendshipRequest request = loadPending(requestId, currentUserId, true);
        request.decline();
        return FriendshipRequestDto.from(request);
    }

    /**
     * Sender withdraws a request that is still pending.
     */
    @Transactional
    public FriendshipRequestDto cancel(Long currentUserId, Long requestId) {
        FriendshipRequest request = loadPending(requestId, currentUserId, false);
        request.cancel();
        return FriendshipRequestDto.from(request);
    }

    // ------------------------------------------------------------------ read

    @Transactional(readOnly = true)
    public PageResponse<FriendshipRequestDto> getIncoming(Long userId, int page, int size) {
        return PageResponse.from(
                requestRepository.findByToUserIdAndStatus(
                        userId, FriendshipStatus.PENDING, pageable(page, size)),
                FriendshipRequestDto::from);
    }

    @Transactional(readOnly = true)
    public PageResponse<FriendshipRequestDto> getOutgoing(Long userId, int page, int size) {
        return PageResponse.from(
                requestRepository.findByFromUserIdAndStatus(
                        userId, FriendshipStatus.PENDING, pageable(page, size)),
                FriendshipRequestDto::from);
    }

    @Transactional(readOnly = true)
    public long countIncoming(Long userId) {
        return requestRepository.countByToUserIdAndStatus(userId, FriendshipStatus.PENDING);
    }

    // --------------------------------------------------------------- helpers

    /**
     * Loads (with a row lock) a request that belongs to the user in the given role
     * and is still pending. A request that isn't yours is reported as 404 so ids
     * can't be probed.
     */
    private FriendshipRequest loadPending(Long requestId, Long userId, boolean asReceiver) {
        FriendshipRequest request = requestRepository.findByIdForUpdate(requestId)
                .orElseThrow(() -> notFound("Friend request not found"));

        Long ownerId = asReceiver ? request.getToUser().getId() : request.getFromUser().getId();
        if (!ownerId.equals(userId)) throw notFound("Friend request not found");
        if (!request.isPending()) throw conflict("Friend request is no longer pending");
        return request;
    }

    private Pageable pageable(int page, int size) {
        return PageRequest.of(
                Math.max(page, 0),
                Math.clamp(size, 1, MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "updatedAt"));
    }

    private static ResponseStatusException badRequest(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }

    private static ResponseStatusException notFound(String msg) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
    }

    private static ResponseStatusException conflict(String msg) {
        return new ResponseStatusException(HttpStatus.CONFLICT, msg);
    }
}