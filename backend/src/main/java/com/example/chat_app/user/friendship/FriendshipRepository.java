package com.example.chat_app.user.friendship;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, FriendshipId> {

    @EntityGraph(attributePaths = {"userOne", "userTwo"})
    @Query("""
            select f from Friendship f
            where f.id.userOneId = :userId or f.id.userTwoId = :userId
            """)
    Page<Friendship> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("""
            select count(f) from Friendship f
            where f.id.userOneId = :userId or f.id.userTwoId = :userIdP
            """)
    long countByUserId(@Param("userId") Long userId);
}