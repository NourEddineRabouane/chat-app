create table friendship_request
(
    id           BIGINT PRIMARY KEY,
    from_user_id BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    to_user_id   BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at   TIMESTAMP            DEFAULT NOW(),
    updated_at   TIMESTAMP            DEFAULT NOW(),
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    CONSTRAINT chk_friendship_request_status
        CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),

    CONSTRAINT chk_friendship_request_no_self
        CHECK (from_user_id <> to_user_id),

    CONSTRAINT uk_friendship_request_from_to
        UNIQUE (from_user_id, to_user_id)
);