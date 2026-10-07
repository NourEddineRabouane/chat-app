package com.example.chat_app.presence;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.script.RedisScript;
import tools.jackson.databind.ObjectMapper;


import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PresenceService {

    private static final Duration TTL = Duration.ofSeconds(30);
    private static final String CHANNEL = "presence-events";

    // EXISTS-then-SET as two separate round trips race if two heartbeats for the same user
    // (e.g. two open tabs) land close together — both could see "missing" before either writes,
    // firing a duplicate online event. This script makes the check-and-set a single atomic step.
    private static final RedisScript<Long> MARK_ONLINE_SCRIPT = RedisScript.of("""
            local existed = redis.call('EXISTS', KEYS[1])
            redis.call('SET', KEYS[1], 'online', 'EX', ARGV[1])
            return existed
            """, Long.class);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Called on WS connect and on every heartbeat. Idempotent — safe to call repeatedly.
     */
    public void markOnline(Long userId) {
        Long existed = redisTemplate.execute(MARK_ONLINE_SCRIPT,
                List.of(key(userId)), String.valueOf(TTL.getSeconds()));
        if (existed != null && existed == 0) {
            publish(new PresenceEvent(userId, "online"));
        }
    }

    /**
     * Called on graceful WS disconnect — the fast path. TTL expiry is the fallback
     * for crashes/dropped connections where this never gets called at all.
     */
    public void markOffline(Long userId) {
        Boolean deleted = redisTemplate.delete(key(userId));
        if (Boolean.TRUE.equals(deleted)) {
            publish(new PresenceEvent(userId, "offline"));
        }
    }

    public boolean isOnline(Long userId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key(userId)));
    }

    /**
     * Batch check — use this for "which of my friends are online" rather than looping isOnline().
     * One round trip via a Redis pipeline instead of N sequential EXISTS calls.
     */
    public Set<Long> filterOnline(Collection<Long> userIds) {
        List<Long> idList = new ArrayList<>(userIds); // fixes iteration order, so results line up by index
        List<Object> results = redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
            idList.forEach(id -> connection.keyCommands().exists(key(id).getBytes()));
            return null;
        });

        Set<Long> online = new HashSet<>();
        for (int i = 0; i < idList.size(); i++) {
            if (Boolean.TRUE.equals(results.get(i))) {
                online.add(idList.get(i));
            }
        }
        return online;
    }

    @SneakyThrows
    private void publish(PresenceEvent event) {
        redisTemplate.convertAndSend(CHANNEL, objectMapper.writeValueAsString(event));
    }

    private String key(Long userId) {
        return "presence:" + userId;
    }
}