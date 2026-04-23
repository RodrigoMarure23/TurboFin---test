-- =========================================
-- EXTENSIONS
-- =========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- USERS
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Usuario',
    status VARCHAR(20) DEFAULT 'Activo',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_status_check 
        CHECK (status IN ('Activo', 'Inactivo'))
);

-- =========================================
-- USER STATS
-- =========================================
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY,
    posts_count INTEGER DEFAULT 0,
    impact_score INTEGER DEFAULT 0,
    last_active TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_user_stats
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- MESSAGES
-- =========================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    parent_id UUID,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_parent_message
        FOREIGN KEY (parent_id)
        REFERENCES messages(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_user_id 
    ON messages(user_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at 
    ON messages(created_at DESC);

-- =========================================
-- LIKES
-- =========================================
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    message_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_message_like 
        UNIQUE (user_id, message_id),
    CONSTRAINT fk_user_like
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_like
        FOREIGN KEY (message_id)
        REFERENCES messages(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_likes_message_id 
    ON likes(message_id);

-- =========================================
-- FUNCTIONS
-- =========================================

-- Inicializar estadísticas de usuario
CREATE OR REPLACE FUNCTION fn_init_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_stats (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sincronizar likes_count e impacto
CREATE OR REPLACE FUNCTION fn_update_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE messages
        SET likes_count = likes_count + 1
        WHERE id = NEW.message_id;

        UPDATE user_stats
        SET impact_score = impact_score + 1
        WHERE user_id = NEW.user_id;

    ELSIF TG_OP = 'DELETE' THEN
        UPDATE messages
        SET likes_count = likes_count - 1
        WHERE id = OLD.message_id;

        UPDATE user_stats
        SET impact_score = impact_score - 1
        WHERE user_id = OLD.user_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- TRIGGERS
-- =========================================

CREATE TRIGGER tr_init_stats
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION fn_init_user_stats();

CREATE TRIGGER tr_sync_likes_and_impact
AFTER INSERT OR DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION fn_update_counters();