CREATE TABLE users (
                       id            BIGINT PRIMARY KEY,          -- assigned by SnowflakeIdGenerator, not serial
                       username      VARCHAR(50)  NOT NULL,
                       email         VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       created_at    TIMESTAMP    NOT NULL DEFAULT now(),
                       CONSTRAINT uq_users_username UNIQUE (username),
                       CONSTRAINT uq_users_email    UNIQUE (email)
);