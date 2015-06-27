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

CREATE DOMAIN aquest_schema.user_names AS VARCHAR(15) CHECK (
    LENGTH(VALUE) > 0 AND
    LENGTH(VALUE) < 16 AND
    VALUE ~ '^[A-Za-z0-9]+$'
);

CREATE TABLE aquest_schema.CHAT(
  "chatId"     BIGSERIAL PRIMARY KEY,
  "name"       TEXT,
  "deleted"    BOOLEAN
);

CREATE TABLE aquest_schema.UNIVERSE(
  "universeId"       BIGSERIAL PRIMARY KEY,
  "name"             TEXT UNIQUE,
  "handler"          TEXT UNIQUE,
  "description"      TEXT,
  "rules"            TEXT,
  "picturePath"      TEXT,
  "created"          TIMESTAMP,
  "chatId"           BIGINT,
  "linkedUniversesIds" BIGINT[],
  "deleted"          BOOLEAN,
  FOREIGN KEY ("chatId") REFERENCES aquest_schema.CHAT
);

CREATE TABLE aquest_schema.USER (
  "userId"            BIGSERIAL PRIMARY KEY,
  "email"             TEXT UNIQUE,
  "userName"          aquest_schema.user_names NOT NULL UNIQUE,
  "firstName"         TEXT,
  "lastName"          TEXT,
  "passwordSalt"      TEXT NOT NULL,
  "passwordHash"      TEXT NOT NULL,
  "bio"               TEXT,
  "picturePath"       TEXT,
  "creationIp"        INET,
  "startUniverse"     BIGINT,
  "created"           TIMESTAMP,
  "deleted"           BOOLEAN,
  FOREIGN KEY ("startUniverse") REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.RANK(
  "rankId"      BIGSERIAL PRIMARY KEY,
  "title"       TEXT,
  "deleted"     BOOLEAN,
  "level"       SMALLINT,
  "universeId"  BIGINT,
  FOREIGN KEY ("universeId") REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.VOTE(
  "voteId"      BIGSERIAL PRIMARY KEY,
  "content"     TEXT,
  "created"     TIMESTAMP,
  "deleted"     BOOLEAN,
  "authorId"    BIGINT,
  "userId"      BIGINT,
  "universeId"  BIGINT,
  FOREIGN KEY ("authorId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("userId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("universeId") REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.GOALS(
  "goalId"      BIGSERIAL PRIMARY KEY,
  "content"     JSON,
  "deleted"     BOOLEAN,
  "rankId"      BIGINT,
  FOREIGN KEY ("rankId") REFERENCES aquest_schema.RANK
);

CREATE TABLE aquest_schema.USER_UNIVERSE(
  "userUniverseId" BIGSERIAL PRIMARY KEY,
  "deleted"        BOOLEAN,
  "userId"         BIGINT,
  "universeId"     BIGINT,
  FOREIGN KEY ("userId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("universeId") REFERENCES aquest_schema.UNIVERSE
);

CREATE TABLE aquest_schema.TOPIC(
  "topicId"      BIGSERIAL PRIMARY KEY,
  "title"        TEXT,
  "handler"      TEXT UNIQUE,
  "created"      TIMESTAMP,
  "deleted"      BOOLEAN,
  "userId"       BIGINT,
  "universeId"   BIGINT,
  "chatId"       BIGINT,
  FOREIGN KEY ("userId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("universeId") REFERENCES aquest_schema.UNIVERSE,
  FOREIGN KEY ("chatId") REFERENCES aquest_schema.CHAT
);

CREATE TABLE aquest_schema.ATOME(
  "atomeId"     BIGSERIAL PRIMARY KEY,
  "type"        TEXT,
  "structure"   JSON,
  "deleted"     BOOLEAN
);

CREATE TABLE aquest_schema.MESSAGE(
  "messageId"   BIGSERIAL PRIMARY KEY,
  "created"     TIMESTAMP,
  "deleted"     BOOLEAN,
  "userId"      BIGINT,
  "chatId"      BIGINT,
  FOREIGN KEY ("userId") REFERENCES aquest_schema.USER,
  FOREIGN KEY ("chatId") REFERENCES aquest_schema.CHAT
);

CREATE TABLE aquest_schema.ATOME_TOPIC(
  "atomeTopicId"    BIGSERIAL PRIMARY KEY,
  "content"         JSON,
  "ordered"         INTEGER,
  "deleted"         BOOLEAN,
  "topicId"         BIGINT,
  "atomeId"         BIGINT,
  FOREIGN KEY ("topicId") REFERENCES aquest_schema.MESSAGE,
  FOREIGN KEY ("atomeId") REFERENCES aquest_schema.ATOME
);

CREATE TABLE aquest_schema.ATOME_MESSAGE(
  "atomeMessageId" BIGSERIAL PRIMARY KEY,
  "content"        JSON,
  "deleted"        BOOLEAN,
  "messageId"      BIGINT,
  "atomeId"        BIGINT,
  FOREIGN KEY ("messageId") REFERENCES aquest_schema.MESSAGE,
  FOREIGN KEY ("atomeId") REFERENCES aquest_schema.ATOME
);

CREATE FUNCTION aquest_schema.create_chat() RETURNS trigger AS $create_chat$
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

INSERT INTO aquest_schema.universe 
    (name, handler, description, "picturePath", "chatId") 
  VALUES 
    ('Startups', 'StartUps', 'This is the description of the StartUp Universe', 'img/pillars_compressed.png', '0');
    
INSERT INTO aquest_schema.universe 
    (name, handler, description, "picturePath", "chatId") 
  VALUES 
    ('Design', 'Design', 'This is the description of the Design Universe', 'img/designer_compressed.png', '0');
    
INSERT INTO aquest_schema.user 
    (email, "userName", "firstName", "lastName", "startUniverse", "passwordSalt", "passwordHash") 
  VALUES 
    ('johndoe@gmail.com', 'johnDoe', 'John', 'Doe', '1', 'fsfgfdgsdfgsdfokoksqlsd', 'dskjfsdkfjks');