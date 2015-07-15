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
  name                TEXT NOT NULL,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now()
);

CREATE TABLE aquest_schema.USER (
  pseudo               aquest_schema.pseudo PRIMARY KEY,
  email                TEXT UNIQUE,
  first_name           TEXT,
  last_name            TEXT,
  password_salt        TEXT NOT NULL,
  password_hash        TEXT NOT NULL,
  bio                  TEXT,
  picture              TEXT,
  creation_ip          INET NOT NULL,
  created_at           TIMESTAMP DEFAULT now(),
  updated_at           TIMESTAMP DEFAULT now()
);

CREATE TABLE aquest_schema.UNIVERSE(
  id                   TEXT PRIMARY KEY,
  chat_id              BIGINT NOT NULL UNIQUE,
  user_id              TEXT NOT NULL,
  name                 TEXT NOT NULL UNIQUE,
  description          TEXT,
  rules                TEXT,
  picture              TEXT,
  created_at           TIMESTAMP DEFAULT now(),
  updated_at           TIMESTAMP DEFAULT now(),
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id),
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(pseudo)
);

CREATE TABLE aquest_schema.UNIVERSE_UNIVERSE(
  id                   BIGSERIAL PRIMARY KEY,
  universe1_id         TEXT NOT NULL,
  universe2_id         TEXT NOT NULL,
  created_at           TIMESTAMP DEFAULT now(),
  updated_at           TIMESTAMP DEFAULT now(),
  FOREIGN KEY (universe1_id) REFERENCES aquest_schema.UNIVERSE(id),
  FOREIGN KEY (universe2_id) REFERENCES aquest_schema.UNIVERSE(id)
);

CREATE TABLE aquest_schema.RANK(
  id                  BIGSERIAL PRIMARY KEY,
  universe_id         TEXT NOT NULL,
  title               TEXT NOT NULL,
  level               SMALLINT NOT NULL,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id)
);

CREATE TABLE aquest_schema.MESSAGE(
  id                  BIGSERIAL PRIMARY KEY,
  user_id             TEXT NOT NULL,
  chat_id             BIGINT NOT NULL,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(pseudo),
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id)
);

CREATE TABLE aquest_schema.VOTE_MESSAGE(
  id                  BIGSERIAL PRIMARY KEY,
  author_id           TEXT NOT NULL,
  user_id             TEXT NOT NULL, 
  universe_id         TEXT NOT NULL,
  message_id          BIGINT NOT NULL,
  content             TEXT NOT NULL,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (author_id) REFERENCES aquest_schema.USER(pseudo),
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(pseudo),
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id),
  FOREIGN KEY (message_id) REFERENCES aquest_schema.MESSAGE(id)
);

CREATE TABLE aquest_schema.VOTE_TOPIC(
  id                  BIGSERIAL PRIMARY KEY,
  author_id           TEXT NOT NULL,
  user_id             TEXT NOT NULL, 
  universe_id         TEXT NOT NULL,
  topic_id            TEXT NOT NULL,
  content             TEXT NOT NULL,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  deleted             BOOLEAN,
  FOREIGN KEY (author_id) REFERENCES aquest_schema.USER(pseudo),
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(pseudo),
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id),
  FOREIGN KEY (topic_id) REFERENCES aquest_schema.UNIVERSE(id)
);

CREATE TABLE aquest_schema.GOALS(
  id                  BIGSERIAL PRIMARY KEY,
  rank_id             BIGINT NOT NULL,
  content             JSON,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  FOREIGN KEY (rank_id) REFERENCES aquest_schema.RANK
);

CREATE TABLE aquest_schema.USER_UNIVERSE(
  id                  BIGSERIAL PRIMARY KEY,
  user_id             TEXT NOT NULL,
  universe_id         TEXT NOT NULL,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  start_universe      BOOLEAN,
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(pseudo),
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id)
);

CREATE TABLE aquest_schema.TOPIC(
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL,
  chat_id             BIGINT NOT NULL,
  universe_id         TEXT NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  picture             TEXT,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(pseudo),
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id),
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id)
);

CREATE TABLE aquest_schema.ATOM(
  id                  BIGSERIAL PRIMARY KEY,
  type                TEXT,
  structure           JSON,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now()
);

CREATE TABLE aquest_schema.ATOM_TOPIC(
  id                  BIGSERIAL PRIMARY KEY,
  atom_id             BIGINT NOT NULL,
  topic_id            TEXT NOT NULL,
  content             JSON NOT NULL,
  position            INTEGER NOT NULL,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  FOREIGN KEY (topic_id) REFERENCES aquest_schema.TOPIC(id),
  FOREIGN KEY (atom_id) REFERENCES aquest_schema.ATOM(id)
);

CREATE TABLE aquest_schema.ATOM_MESSAGE(
  id                  BIGSERIAL PRIMARY KEY,
  atom_id             BIGINT NOT NULL,
  message_id          BIGINT NOT NULL,
  content             JSON NOT NULL,
  created_at          TIMESTAMP DEFAULT now(),
  updated_at          TIMESTAMP DEFAULT now(),
  FOREIGN KEY (message_id) REFERENCES aquest_schema.MESSAGE(id),
  FOREIGN KEY (atom_id) REFERENCES aquest_schema.ATOM(id)
);

-- automaticaly create a chat and assign it's ID before creating a topic
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

-- automaticaly create a chat and assign it's ID before creating a universe
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

-- Create chat before create universe
CREATE TRIGGER create_chat
  BEFORE INSERT
  ON aquest_schema.universe
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.create_chat_universe();

-- Create chat before create topic  
CREATE TRIGGER create_chat
  BEFORE INSERT
  ON aquest_schema.topic
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.create_chat_topic();
  
  
CREATE FUNCTION aquest_schema.set_updated_timestamp()
  RETURNS TRIGGER AS $set_updated_timestamp$
  BEGIN
    NEW.updated_at := now(); 
    RETURN NEW;
  END;
$set_updated_timestamp$ LANGUAGE plpgsql;

CREATE TRIGGER update_timestamp
  BEFORE UPDATE 
  ON aquest_schema.universe 
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.set_updated_timestamp();

-- concat an array of JSON object into JSON properties  
CREATE OR REPLACE FUNCTION aquest_schema.concat_json_array(json_array JSON)
RETURNS JSON AS $$
  var o = {};
  for(var i = 0, json_array_length = json_array.length ; i < json_array_length ; i++){
    for(var key in json_array[i]){
      o[key] = json_array[i][key];
    }
  }
  return o;
$$ LANGUAGE plv8 IMMUTABLE STRICT;

-- concat two JSON objects in one JSON object
CREATE OR REPLACE FUNCTION aquest_schema.concat_json_object(obj1 JSON, obj2 JSON)
RETURNS JSON AS $$
	var o = {};
	for(var key1 in obj1){
		o[key1] = obj1[key1];
	}
	for(var key2 in obj2){
		o[key2] = obj2[key2];
	}
  return o;
$$ LANGUAGE plv8 IMMUTABLE STRICT;

-- insert a bunch of data
INSERT INTO aquest_schema.user 
    (email, pseudo, first_name, last_name, password_salt, password_hash, creation_ip) 
  VALUES 
    ('johndoe@gmail.com', 'johnDoe', 'John', 'Doe', 'fsfgfdgsdfgsdfokoksqlsd', 'dskjfsdkfjks', '192.168.0.1');

INSERT INTO aquest_schema.universe 
    (id, name, user_id, description, picture) 
  VALUES 
    ('Startups', 'Startups', 'johnDoe', 'This is the description of the Startups universe', 'img/pillars_compressed.png');
    
INSERT INTO aquest_schema.universe 
    (id, name, user_id, description, picture) 
  VALUES 
    ('Design', 'Design', 'johnDoe', 'This is the description of the Design Universe', 'img/designer_compressed.png');
    
INSERT INTO aquest_schema.topic 
    (id, user_id, universe_id, title) 
  VALUES 
    ('newStartup', 'johnDoe', 'Startups', 'Aquest Technologies');
    
INSERT INTO aquest_schema.topic 
    (id, user_id, universe_id, title) 
  VALUES 
    ('newStartup-oi8', 'johnDoe', 'Startups', 'David et Augustin');
    
INSERT INTO aquest_schema.atom 
  (type,structure) 
VALUES 
  ('text','{"text":"^[A-Za-z][0-9]+$"}');

 INSERT INTO aquest_schema.message 
  (user_id,chat_id) 
VALUES 
  ('johnDoe','1');

INSERT INTO aquest_schema.atom_message 
  (atom_id, message_id, content) 
VALUES 
  (1, 1, '{"text":"hello"}');
  
INSERT INTO aquest_schema.atom_topic 
  (atom_id, topic_id, content, position) 
VALUES 
  (1,'newStartup','{"text":"Topic about nothing"}',0);

INSERT INTO aquest_schema.atom_topic 
  (atom_id, topic_id, content, position) 
VALUES 
  (1,'newStartup','{"text":"WITH NOTHING !!!"}',1);