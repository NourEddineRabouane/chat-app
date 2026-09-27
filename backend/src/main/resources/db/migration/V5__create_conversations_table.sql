CREATE TABLE conversations (
                               id            BIGINT PRIMARY KEY,        -- Snowflake ID; becomes message.conversation_id
                               member_one_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               member_two_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               created_at    TIMESTAMP NOT NULL DEFAULT now(),

    -- canonical ordering means exactly one row per pair, no matter who
    -- started the conversation — lookups always go LEAST(a,b), GREATEST(a,b)
                               CONSTRAINT chk_conversations_ordered_members CHECK (member_one_id < member_two_id),
                               CONSTRAINT uq_conversations_pair UNIQUE (member_one_id, member_two_id)
);