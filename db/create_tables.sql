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
GRANT SELECT, UPDATE, INSERT ON SEQUENCES TO users;

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
  "id"                  BIGSERIAL PRIMARY KEY,
  "name"                TEXT,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN
);

CREATE TABLE aquest_schema.UNIVERSE(
  "id"                  BIGSERIAL PRIMARY KEY,
  "chatId"              BIGINT,
  "name"                TEXT UNIQUE,
  "handler"             TEXT UNIQUE,
  "description"         TEXT,
  "rules"               TEXT,
  "picturePath"         TEXT,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("chatId") REFERENCES aquest_schema.CHAT
);

CREATE TABLE aquest_schema.UNIVERSE_UNIVERSE(
  "id"                  BIGSERIAL PRIMARY KEY,
  "universe1Id"         BIGINT,
  "universe2Id"         BIGINT,
  "force"               BIGINT,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("universe1Id") REFERENCES aquest_schema.UNIVERSE
  FOREIGN KEY ("universe2Id") REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.USER (
  "id"                  BIGSERIAL PRIMARY KEY,
  "email"               TEXT UNIQUE,
  "pseudo"              aquest_schema.user_names NOT NULL UNIQUE,
  "firstName"           TEXT,
  "lastName"            TEXT,
  "passwordSalt"        TEXT NOT NULL,
  "passwordHash"        TEXT NOT NULL,
  "bio"                 TEXT,
  "picturePath"         TEXT,
  "creationIp"          INET,
  "startUniverseId"     BIGINT,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("startUniverseId") REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.RANK(
  "id"                  BIGSERIAL PRIMARY KEY,
  "universeId"          BIGINT,
  "title"               TEXT,
  "level"               SMALLINT,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("universeId") REFERENCES aquest_schema.UNIVERSE
);

-- Comment le vote s'attache à un topic ou un message?
-- universeId est-t-il redondant?
CREATE TABLE aquest_schema.VOTE(
  "id"                  BIGSERIAL PRIMARY KEY,
  "authorId"            BIGINT,
  "userId"              BIGINT, 
  "universeId"          BIGINT,
  "content"             TEXT,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("authorId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("userId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("universeId") REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.GOALS(
  "id"                  BIGSERIAL PRIMARY KEY,
  "rankId"              BIGINT,
  "content"             JSON,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("rankId") REFERENCES aquest_schema.RANK
);

CREATE TABLE aquest_schema.USER_UNIVERSE(
  "id"                  BIGSERIAL PRIMARY KEY,
  "userId"              BIGINT,
  "universeId"          BIGINT,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("userId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("universeId") REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.TOPIC(
  "id"                  BIGSERIAL PRIMARY KEY,
  "userId"              BIGINT,
  "chatId"              BIGINT,
  "universeId"          BIGINT,
  "title"               TEXT,
  "handle"              TEXT UNIQUE,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("userId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("universeId") REFERENCES aquest_schema.UNIVERSE,
  FOREIGN KEY ("chatId") REFERENCES aquest_schema.CHAT
);

CREATE TABLE aquest_schema.ATOME(
  "id"                  BIGSERIAL PRIMARY KEY,
  "type"                TEXT,
  "structure"           JSON,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN
);

CREATE TABLE aquest_schema.MESSAGE(
  "id"                  BIGSERIAL PRIMARY KEY,
  "userId"              BIGINT,
  "chatId"              BIGINT,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("userId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("chatId") REFERENCES aquest_schema.CHAT
);

CREATE TABLE aquest_schema.ATOME_TOPIC(
  "id"                  BIGSERIAL PRIMARY KEY,
  "atomeId"             BIGINT,
  "topicId"             BIGINT,
  "content"             JSON,
  "order"               INTEGER,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("topicId") REFERENCES aquest_schema.MESSAGE,
  FOREIGN KEY ("atomeId") REFERENCES aquest_schema.ATOME
);

CREATE TABLE aquest_schema.ATOME_MESSAGE(
  "id"                  BIGSERIAL PRIMARY KEY,
  "atomeId"             BIGINT,
  "messageId"           BIGINT,
  "content"             JSON,
  "createdAt"           TIMESTAMP DEFAULT now(),
  "updatedAt"           TIMESTAMP DEFAULT now(),
  "deleted"             BOOLEAN,
  FOREIGN KEY ("messageId") REFERENCES aquest_schema.MESSAGE,
  FOREIGN KEY ("atomeId") REFERENCES aquest_schema.ATOME
);



CREATE FUNCTION aquest_schema.create_chat() 
  RETURNS trigger AS $create_chat$
  DECLARE
      last_chat_id BIGINT;
  BEGIN
      INSERT INTO aquest_schema.chat (name) VALUES (NEW.name) RETURNING "chatId" INTO last_chat_id;
      NEW."chatId" := last_chat_id;
      RETURN NEW;
  END;
$create_chat$ LANGUAGE plpgsql;

CREATE TRIGGER create_chat
  BEFORE INSERT
  ON aquest_schema.universe
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.create_chat();
  
CREATE TRIGGER create_chat
  BEFORE INSERT
  ON aquest_schema.topic
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.create_chat();
  
  
  
  
CREATE FUNCTION set_updated_timestamp()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $update_timestamp$ 
  BEGIN
    NEW."updatedAt" := now(); -- risque de ne pas marcher
    RETURN NEW;
  END;
  $update_timestamp$;

CREATE TRIGGER update_timestamp
  BEFORE UPDATE 
  ON aquest_schema.universe -- Pk préciser un schema ?
  FOR EACH ROW EXECUTE PROCEDURE set_updated_timestamp();
  
-- ... déjà si ça marche c'est bien
  
  
  

INSERT INTO aquest_schema.universe 
    (name, handler, description, "picturePath", "chatId") 
  VALUES 
    ('Startups', 'Startups', 'This is the description of the Startups universe', 'img/pillars_compressed.png', '0');
    
INSERT INTO aquest_schema.universe 
    (name, handler, description, "picturePath", "chatId") 
  VALUES 
    ('Design', 'Design', 'This is the description of the Design Universe', 'img/designer_compressed.png', '0');
    
INSERT INTO aquest_schema.user 
    (email, "userName", "firstName", "lastName", "startUniverse", "passwordSalt", "passwordHash") 
  VALUES 
    ('johndoe@gmail.com', 'johnDoe', 'John', 'Doe', '1', 'fsfgfdgsdfgsdfokoksqlsd', 'dskjfsdkfjks');