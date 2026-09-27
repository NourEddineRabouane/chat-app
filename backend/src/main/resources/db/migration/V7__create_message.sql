CREATE TABLE message (
                         conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
                         message_id      BIGINT NOT NULL,          -- Snowflake ID; determines order, not created_at
                         sender_id       BIGINT NOT NULL REFERENCES users(id),
                         content         TEXT   NOT NULL,
                         created_at      TIMESTAMP NOT NULL DEFAULT now(),
                         PRIMARY KEY (conversation_id, message_id)
);

-- conversation_id leads the primary key, exactly like chat_group_message.channel_id —
-- both message tables now shaped the same way, no directional lookup indexes needed.