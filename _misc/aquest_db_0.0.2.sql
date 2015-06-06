//TIMESTAMP

CREATE DATABASE aquestdb ENCODING 'UTF8' TEMPLATE template0 WITH onwer=admin;
CREATE SCHEMA aquest_schema;
ALTER DATABASE aquestdb SET search_path='"$user", public, aquest_schema';

GRANT ALL ON ALL TABLES IN SCHEMA aquest_schema TO admin WITH GRANT OPTION;
GRANT SELECT, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA aquest_schema TO users;

GRANT USAGE ON SCHEMA aquest_schema TO users;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema 
GRANT SELECT, REFERENCES ON TABLES TO users;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema
GRANT ALL ON TABLES TO admin WITH GRANT OPTION;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema
GRANT SELECT, UPDATE ON SEQUENCES TO users;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema
GRANT ALL ON FUNCTIONS TO admin WITH GRANT OPTION;

ALTER DEFAULT PRIVILEGES IN SCHEMA aquest_schema
GRANT USAGE ON TYPES TO users;

CREATE DOMAIN aquest_schema.user_names TEXT CHECK (
    LENGTH(VALUE) > 0 AND
    LENGTH(VALUE) < 16 AND
    VALUE ~ '^[A-Za-z0-9]+$'
);

CREATE TABLE aquest_schema.USER (
  userId            BIGSERIAL PRIMARY KEY,
  email             TEXT() UNIQUE,
  userName          user_names NOT NULL UNIQUE,
  firstName         TEXT(),
  lastName          TEXT(),
  passwordSalt      TEXT() NOT NULL,
  passwordHash      TEXT() NOT NULL,
  bio               TEXT(),
  picturePath       TEXT(),
  creationIp        TEXT(),
  startUniverse     BIGSERIAL,
  FOREIGN KEY (startUniverse) REFERENCES UNIVERSE
);

CREATE TABLE aquest_schema.RANK(
  rankId      BIGSERIAL PRIMARY KEY,
  title       TEXT(),
  level       INT,
  universeId  BIGSERIAL,
  FOREIGN KEY (universeId) REFERENCES UNIVERSE
);

CREATE TABLE aquest_schema.VOTE(
  voteId          BIGSERIAL PRIMARY KEY,
  content         TEXT(),
  authorId        BIGSERIAL,
  userId          BIGSERIAL,
  universeId      BIGSERIAL,
  FOREIGN KEY (authorId) REFERENCES USER,
  FOREIGN KEY (userId) REFERENCES USER,
  FOREIGN KEY (universeId) REFERENCES UNIVERSE
);

CREATE TABLE aquest_schema.GOALS(
  goalId      BIGSERIAL PRIMARY KEY,
  content     JSON,
  rankId      BIGSERIAL,
  FOREIGN KEY (rankId) REFERENCES RANK
);

CREATE TABLE aquest_schema.USER_UNIVERSE(
  userUniverseId BIGSERIAL PRIMARY KEY,
  userId         BIGSERIAL,
  universeId     BIGSERIAL,
  FOREIGN KEY (userId) REFERENCES USER,
  FOREIGN KEY (universeId) REFERENCES UNIVERSE
);

CREATE TABLE aquest_schema.UNIVERSE(
  universeId    BIGSERIAL PRIMARY KEY,
  name          TEXT() UNIQUE,
  description   TEXT(),
  rules         TEXT(),
  picturePath   TEXT(),
  chatId        BIGSERIAL,
  FOREIGN KEY (chatId) REFERENCES CHAT
);

CREATE TABLE aquest_schema.TOPIC(
  topicId      BIGSERIAL PRIMARY KEY,
  title        TEXT(),
  flag         TEXT(),
  universeId   BIGSERIAL,
  chatId       BIGSERIAL,
  FOREIGN KEY (userId) REFERENCES USER,
  FOREIGN KEY (universeId) REFERENCES UNIVERSE,
  FOREIGN KEY (chatId) REFERENCES CHAT
);

CREATE TABLE aquest_schema.ATOME_TOPIC(
  atomeTopicId    BIGSERIAL PRIMARY KEY,
  content         JSON,
  order           INT,
  topicId         BIGSERIAL,
  atomeId         BIGSERIAL,
  FOREIGN KEY (topicId) REFERENCES MESSAGE,
  FOREIGN KEY (atomeId) REFERENCES ATOME
);

CREATE TABLE aquest_schema.CHAT(
  chatId     BIGSERIAL PRIMARY KEY
);

CREATE TABLE aquest_schema.MESSAGE(
  messageId   BIGSERIAL PRIMARY KEY,
  userId      BIGSERIAL,
  chatId      BIGSERIAL,
  FOREIGN KEY (userId) REFERENCES USER,
  FOREIGN KEY (chatId) REFERENCES CHAT
);

CREATE TABLE aquest_schema.ATOME_MESSAGE(
  atomeMessageId BIGSERIAL PRIMARY KEY,
  content        JSON,
  messageId      BIGSERIAL,
  atomeId        BIGSERIAL,
  FOREIGN KEY (messageId) REFERENCES MESSAGE,
  FOREIGN KEY (atomeId) REFERENCES ATOME
);

CREATE TABLE aquest_schema.ATOME(
  atomeId     BIGSERIAL PRIMARY KEY,
  type        TEXT(),
  structure   JSON
);