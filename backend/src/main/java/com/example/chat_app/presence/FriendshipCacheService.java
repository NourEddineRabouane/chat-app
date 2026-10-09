package com.example.chat_app.presence;

import com.example.chat_app.user.friendship.FriendshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipCacheService {
    private final Duration CACHE_TTL = Duration.ofHours(1);

    private final StringRedisTemplate redisTemplate;
    private final FriendshipRepository friendshipRepository;

    /**
     * Get Friends from Redis cache or Postgres Db
     */
    public Set<Long> getFriends(Long userId) {
        String key = key(userId);
        Set<String> cached = redisTemplate.opsForSet().members(key);

        if (cached != null && !cached.isEmpty()) { // The cashed should not be an empty set
            return cached.stream().map(Long::valueOf).collect(Collectors.toSet());
        }

        // If there is no cache, We have to call the DB
        List<Long> friends = friendshipRepository.findFriendIds(userId);

        if (!friends.isEmpty()) {
            String[] asString = friends.stream().map(String::valueOf).toArray(String[]::new);
            redisTemplate.opsForSet().add(key, asString);
            redisTemplate.expire(key, CACHE_TTL);
        } else {
            // negative-cache briefly so a friendless user doesn't hammer Postgres
            // on every presence event. Short TTL so it self-heals when they add a friend.
            redisTemplate.opsForValue().set(key + ":empty", "1", Duration.ofMinutes(5));
        }
        return Set.copyOf(friends);
    }

    /**
     * Called when ever a friendship is accepted, removed or declined... (from the FriendshipRequestService)
     */
    public void invalidate(Long userId) {
        redisTemplate.delete(key(userId));
    }

    private String key(Long userId) {
        return "friends:" + userId;
    }

}
