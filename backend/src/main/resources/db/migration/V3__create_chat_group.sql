CREATE TABLE chat_group (
                            group_id BIGINT       PRIMARY KEY,   -- same ID space as chat_group_message.group_id
                            name       VARCHAR(100) NOT NULL,
                            created_by BIGINT       NOT NULL REFERENCES users(id),
                            created_at TIMESTAMP    NOT NULL DEFAULT now()
);