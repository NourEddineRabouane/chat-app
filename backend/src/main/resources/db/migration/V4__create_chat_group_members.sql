CREATE TABLE chat_group_member (
                                   group_id BIGINT      NOT NULL REFERENCES chat_group(group_id) ON DELETE CASCADE,
                                   user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                   role       VARCHAR(20) NOT NULL DEFAULT 'member',   -- member | admin
                                   joined_at  TIMESTAMP   NOT NULL DEFAULT now(),
                                   PRIMARY KEY (group_id, user_id)
);

-- so "which groups is this user in" is fast (needed by the conversation-list query in §2.2)
CREATE INDEX idx_chat_group_member_user_id ON chat_group_member (user_id);