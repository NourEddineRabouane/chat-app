CREATE TABLE chat_group_message (
                                    group_id BIGINT NOT NULL REFERENCES chat_group(group_id),
                                    message_id BIGINT NOT NULL,             -- Snowflake ID, assigned by the app
                                    user_id    BIGINT NOT NULL REFERENCES users(id),
                                    content    TEXT   NOT NULL,
                                    created_at TIMESTAMP NOT NULL DEFAULT now(),
                                    PRIMARY KEY (group_id, message_id)
);

-- group_id leads the primary key, so "messages in channel X by message_id"
-- is already covered by the PK index — nothing extra needed here.