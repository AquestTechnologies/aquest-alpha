DROP SCHEMA if exists aquest_schema CASCADE;
CREATE SCHEMA aquest_schema;
ALTER SCHEMA aquest_schema OWNER TO admin;
ALTER DATABASE aquestdb SET search_path='"$user", public, aquest_schema';

GRANT ALL ON ALL TABLES IN SCHEMA aquest_schema TO admin WITH GRANT OPTION;
GRANT SELECT, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA aquest_schema TO users;

GRANT USAGE ON SCHEMA aquest_schema TO users;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema 
GRANT SELECT, REFERENCES, INSERT ON TABLES TO users;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema
GRANT ALL ON TABLES TO admin WITH GRANT OPTION;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema
GRANT SELECT, UPDATE ON SEQUENCES TO users;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema
GRANT ALL ON FUNCTIONS TO admin WITH GRANT OPTION;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema
GRANT USAGE ON TYPES TO users;

CREATE DOMAIN aquest_schema.pseudo AS VARCHAR(15) CHECK (
    LENGTH(VALUE) > 0 AND
    LENGTH(VALUE) < 16 AND
    VALUE ~ '^[A-Za-z0-9]+$'
);

CREATE TABLE aquest_schema.CHAT(
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN
);

CREATE TABLE aquest_schema.UNIVERSE(
  id                   BIGSERIAL PRIMARY KEY,
  chat_id              BIGINT,
  name                 TEXT UNIQUE,
  handle               TEXT UNIQUE,
  description          TEXT,
  rules                TEXT,
  picture              TEXT,
  created_at           TIMESTAMP DEFAULT now(),
  updated_at           TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id)
);

CREATE TABLE aquest_schema.UNIVERSE_UNIVERSE(
  id                   BIGSERIAL PRIMARY KEY,
  universe1_id         BIGINT,
  universe2_id         BIGINT,
  force                BIGINT,
  created_at           TIMESTAMP DEFAULT now(),
  updated_at           TIMESTAMP DEFAULT now(),
  deleted              BOOLEAN,
  FOREIGN KEY (universe1_id) REFERENCES aquest_schema.UNIVERSE,
  FOREIGN KEY (universe2_id) REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.USER (
  id                   BIGSERIAL PRIMARY KEY,
  email                TEXT UNIQUE,
  pseudo               aquest_schema.pseudo NOT NULL UNIQUE,
  first_name           TEXT,
  last_name            TEXT,
  password_salt        TEXT NOT NULL,
  password_hash        TEXT NOT NULL,
  bio                  TEXT,
  picture              TEXT,
  creation_ip          INET,
  start_universe_id    BIGINT,
  created_at           TIMESTAMP DEFAULT now(),
  updated_at           TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (start_universe_id) REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.RANK(
  id                  BIGSERIAL PRIMARY KEY,
  universe_id         BIGINT,
  title               TEXT,
  level               SMALLINT,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE
);

-- Comment le vote s'attache à un topic ou un message?
-- universe_id est-t-il redondant?
CREATE TABLE aquest_schema.VOTE(
  id                  BIGSERIAL PRIMARY KEY,
  author_id           BIGINT,
  user_id             BIGINT, 
  universe_id         BIGINT,
  content             TEXT,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (author_id) REFERENCES aquest_schema.USER,
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER,
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.GOALS(
  id                  BIGSERIAL PRIMARY KEY,
  rank_id             BIGINT,
  content             JSON,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (rank_id) REFERENCES aquest_schema.RANK
);

CREATE TABLE aquest_schema.USER_UNIVERSE(
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT,
  universe_id         BIGINT,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER,
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.TOPIC(
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT,
  chat_id             BIGINT,
  universe_id         BIGINT,
  title               TEXT,
  handle              TEXT UNIQUE,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER,
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE,
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id)
);

CREATE TABLE aquest_schema.ATOME(
  id                  BIGSERIAL PRIMARY KEY,
  type                TEXT,
  structure           JSON,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN
);

CREATE TABLE aquest_schema.MESSAGE(
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT,
  chat_id             BIGINT,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER,
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id)
);

CREATE TABLE aquest_schema.ATOME_TOPIC(
  id                  BIGSERIAL PRIMARY KEY,
  atome_id            BIGINT,
  topic_id            BIGINT,
  content             JSON,
  "order"             INTEGER,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (topic_id) REFERENCES aquest_schema.MESSAGE,
  FOREIGN KEY (atome_id) REFERENCES aquest_schema.ATOME
);

CREATE TABLE aquest_schema.ATOME_MESSAGE(
  id                  BIGSERIAL PRIMARY KEY,
  atome_id            BIGINT,
  message_id          BIGINT,
  content             JSON,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (message_id) REFERENCES aquest_schema.MESSAGE,
  FOREIGN KEY (atome_id) REFERENCES aquest_schema.ATOME
);

CREATE FUNCTION aquest_schema.create_chat_topic() 
  RETURNS trigger AS $create_chat_topic$
  DECLARE
      last_chat_id BIGINT;
      chat_name TEXT;
  BEGIN
      INSERT INTO aquest_schema.chat (name) VALUES (NEW.title) RETURNING id INTO last_chat_id;
      NEW.chat_id := last_chat_id;
      RETURN NEW;
  END;
$create_chat_topic$ LANGUAGE plpgsql;


CREATE FUNCTION aquest_schema.create_chat_universe() 
  RETURNS trigger AS $create_chat_universe$
  DECLARE
      last_chat_id BIGINT;
      chat_name TEXT;
  BEGIN
      INSERT INTO aquest_schema.chat (name) VALUES (NEW.name) RETURNING id INTO last_chat_id;
      NEW.chat_id := last_chat_id;
      RETURN NEW;
  END;
$create_chat_universe$ LANGUAGE plpgsql;

CREATE TRIGGER create_chat
  BEFORE INSERT
  ON aquest_schema.universe
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.create_chat_universe();
  
CREATE TRIGGER create_chat
  BEFORE INSERT
  ON aquest_schema.topic
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.create_chat_topic();
  
  
CREATE FUNCTION aquest_schema.set_updated_timestamp()
  RETURNS TRIGGER AS $set_updated_timestamp$
  BEGIN
    NEW.updated_at := now(); -- risque de ne pas marcher
    RETURN NEW;
  END;
$set_updated_timestamp$ LANGUAGE plpgsql;

CREATE TRIGGER update_timestamp
  BEFORE UPDATE 
  ON aquest_schema.universe -- Pk préciser un schema ? Les bases de données fonctionnent avec des schémas, si tu n'en met pas tout vas dans public, pour des raison de sécurité il vaut mieux créer un schéma pour configurer les accès en fonction des utilisateurs  (plutôt que de le faire pour chaque table, ...)
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.set_updated_timestamp();
  
-- ... déjà si ça marche c'est bien
  
  
  

INSERT INTO aquest_schema.universe 
    (name, handle, description, picture, chat_id) 
  VALUES 
    ('Startups', 'Startups', 'This is the description of the Startups universe', 'img/pillars_compressed.png', '0');
    
INSERT INTO aquest_schema.universe 
    (name, handle, description, picture, chat_id) 
  VALUES 
    ('Design', 'Design', 'This is the description of the Design Universe', 'img/designer_compressed.png', '0');
    
INSERT INTO aquest_schema.user 
    (email, pseudo, first_name, last_name, start_universe_id, password_salt, password_hash) 
  VALUES 
    ('johndoe@gmail.com', 'johnDoe', 'John', 'Doe', '1', 'fsfgfdgsdfgsdfokoksqlsd', 'dskjfsdkfjks');