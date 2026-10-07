package com.example.chat_app.user.friendship;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    /**
     * Find the friends of a given user
     */
    @Query("""
            SELECT CASE WHEN f.id.userOneId = :userId THEN f.id.userTwoId ELSE f.id.userOneId END
            FROM Friendship f
            WHERE f.id.userOneId = :userId OR f.id.userTwoId = :userId
            """)
    List<Long> findFriendIds(@Param("userId") Long userId);

}