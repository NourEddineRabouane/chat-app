package com.example.chat_app.user.friendship;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendshipRequestRepository extends JpaRepository<FriendshipRequest, Long> {

    Optional<FriendshipRequest> findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);

    /**
     * Row lock so two simultaneous accept/decline/cancel calls can't both win.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from FriendshipRequest r where r.id = :id")
    Optional<FriendshipRequest> findByIdForUpdate(@Param("id") Long id);

    /**
     * Requests I received (the sender is what the UI needs).
     */
    @EntityGraph(attributePaths = "fromUser")
    Page<FriendshipRequest> findByToUserIdAndStatus(Long toUserId, FriendshipStatus status, Pageable pageable);

    /**
     * Requests I sent (the receiver is what the UI needs).
     */
    @EntityGraph(attributePaths = "toUser")
    Page<FriendshipRequest> findByFromUserIdAndStatus(Long fromUserId, FriendshipStatus status, Pageable pageable);

    long countByToUserIdAndStatus(Long toUserId, FriendshipStatus status);
}