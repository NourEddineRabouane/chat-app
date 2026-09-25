CREATE TABLE message (
                         message_id   BIGINT PRIMARY KEY,        -- Snowflake ID; determines order, not created_at
                         message_from BIGINT NOT NULL REFERENCES users(id),
                         message_to   BIGINT NOT NULL REFERENCES users(id),
                         content      TEXT   NOT NULL,
                         created_at   TIMESTAMP NOT NULL DEFAULT now()
);

-- Postgres has no channel_id to partition by for 1-1 chat, so both directions
-- of a conversation need their own covering index (see §2's Cassandra caveat)
CREATE INDEX idx_message_from_to ON message (message_from, message_to, message_id DESC);
CREATE INDEX idx_message_to_from ON message (message_to, message_from, message_id DESC);