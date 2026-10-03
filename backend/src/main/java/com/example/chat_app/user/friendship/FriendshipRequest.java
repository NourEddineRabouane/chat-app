package com.example.chat_app.user.friendship;

import com.example.chat_app.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "friendship_request")
@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FriendshipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private FriendshipStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (status == null) status = FriendshipStatus.PENDING;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /// ---------------
    public boolean isPending() {
        return status == FriendshipStatus.PENDING;
    }

    public void accept() {
        requirePending();
        status = FriendshipStatus.ACCEPTED;
    }

    public void decline() {
        requirePending();
        status = FriendshipStatus.DECLINED;
    }

    public void cancel() {
        requirePending();
        status = FriendshipStatus.CANCELED;
    }

    /**
     * Send again after a decline / cancel / an old accepted-then-unfriended request.
     */
    public void reopen() {
        if (isPending()) throw new IllegalStateException("Request is already pending");
        status = FriendshipStatus.PENDING;
    }

    private void requirePending() {
        if (!isPending()) throw new IllegalStateException("Request is not pending");
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FriendshipRequest other)) return false;
        return id != null && id.equals(other.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}