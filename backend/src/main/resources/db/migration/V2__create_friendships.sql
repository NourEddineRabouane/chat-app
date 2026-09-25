CREATE TABLE friendships (
                             user_id    BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                             friend_id  BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                             status     VARCHAR(20) NOT NULL DEFAULT 'pending',   -- pending | accepted | blocked
                             created_at TIMESTAMP   NOT NULL DEFAULT now(),
                             PRIMARY KEY (user_id, friend_id),
                             CONSTRAINT chk_friendships_no_self CHECK (user_id <> friend_id)
);

-- so "who are my friends" is fast from either direction
CREATE INDEX idx_friendships_friend_id ON friendships (friend_id);