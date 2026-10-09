package com.example.chat_app.config;


import com.example.chat_app.presence.PresenceEventSubscriber;
import com.example.chat_app.typing.TypingEventSubscriber;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {

    private final PresenceEventSubscriber presenceEventSubscriber;
    private final TypingEventSubscriber typingEventSubscriber;

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(RedisConnectionFactory connectionFactory) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        // Presence channel → presence adapter
        container.addMessageListener(
                presenceListenerAdapter(),
                new ChannelTopic("presence-events")
        );

        // Typing channel → typing adapter
        container.addMessageListener(
                typingListenerAdapter(),
                new ChannelTopic("typing-events")
        );
        return container;
    }

    @Bean
    public MessageListenerAdapter presenceListenerAdapter() {
        // "onMessage" here is looked up by reflection at runtime — a typo in this string
        // fails silently (no messages ever delivered) rather than at compile time, so if
        // presence updates mysteriously don't arrive, this line is the first thing to check
        return new MessageListenerAdapter(presenceEventSubscriber, "onMessage");
    }

    @Bean
    public MessageListenerAdapter typingListenerAdapter() {
        return new MessageListenerAdapter(typingEventSubscriber, "onMessage");
    }
}