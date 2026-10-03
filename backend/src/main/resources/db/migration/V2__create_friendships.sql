CREATE TABLE friendships
(
    user_one_id BIGINT    NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    user_two_id BIGINT    NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    PRIMARY KEY (user_one_id, user_two_id),
    CONSTRAINT chk_friendships_no_self CHECK (user_one_id <> user_two_id)
);

