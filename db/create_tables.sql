------------
-- SCHEMA --
------------
DROP SCHEMA if exists aquest_schema CASCADE;
CREATE SCHEMA aquest_schema;
ALTER SCHEMA aquest_schema OWNER TO admin;
ALTER DATABASE aquestdb SET search_path='"$user", public, aquest_schema';


-----------------
-- PRIVILEDGES --
-----------------
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


------------
-- TABLES --
------------
CREATE TABLE aquest_schema.USER (
  id                   TEXT PRIMARY KEY,
  email                TEXT NOT NULL UNIQUE,
  password_hash        TEXT NOT NULL,
  creation_ip          INET NOT NULL,
  first_name           TEXT DEFAULT '',
  last_name            TEXT DEFAULT '',
  picture              TEXT DEFAULT '',
  bio                  TEXT DEFAULT '',
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE aquest_schema.CHAT(
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE aquest_schema.UNIVERSE(
  id                   TEXT PRIMARY KEY,
  chat_id              BIGINT NOT NULL UNIQUE,
  user_id              TEXT NOT NULL,
  creation_ip          INET NOT NULL,
  name                 TEXT NOT NULL,
  picture              TEXT NOT NULL,
  description          TEXT DEFAULT '',
  rules                TEXT DEFAULT '',
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id),
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(id)
);

CREATE TABLE aquest_schema.UNIVERSE_UNIVERSE(
  id                   BIGSERIAL PRIMARY KEY,
  universe1_id         TEXT NOT NULL,
  universe2_id         TEXT NOT NULL,
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (universe1_id) REFERENCES aquest_schema.UNIVERSE(id),
  FOREIGN KEY (universe2_id) REFERENCES aquest_schema.UNIVERSE(id)
);

CREATE TABLE aquest_schema.TOPIC(
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL,
  chat_id             BIGINT NOT NULL UNIQUE,
  universe_id         TEXT NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT DEFAULT '',
  picture             TEXT DEFAULT '',
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(id),
  FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id),
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id)
);

CREATE TABLE aquest_schema.ATOMTOPIC(
  id                  BIGSERIAL PRIMARY KEY,
  topic_id            TEXT NOT NULL,
  type                TEXT NOT NULL,
  content             JSON NOT NULL,
  position            INTEGER NOT NULL,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (topic_id) REFERENCES aquest_schema.TOPIC(id)
);

CREATE TABLE aquest_schema.ATOMMESSAGE(
  id                  BIGSERIAL PRIMARY KEY,
  chat_id             BIGINT NOT NULL,
  user_id             TEXT NOT NULL,
  type                TEXT NOT NULL,
  content             JSON NOT NULL,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (chat_id) REFERENCES aquest_schema.CHAT(id),
  FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(id)
);

-- CREATE TABLE aquest_schema.RANK(
--   id                  BIGSERIAL PRIMARY KEY,
--   universe_id         TEXT NOT NULL,
--   title               TEXT NOT NULL,
--   level               SMALLINT NOT NULL,
--   created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id)
-- );

-- CREATE TABLE aquest_schema.VOTE_MESSAGE(
--   id                  BIGSERIAL PRIMARY KEY,
--   author_id           TEXT NOT NULL,
--   user_id             TEXT NOT NULL, 
--   universe_id         TEXT NOT NULL,
--   message_id          BIGINT NOT NULL,
--   content             TEXT NOT NULL,
--   created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   FOREIGN KEY (author_id) REFERENCES aquest_schema.USER(id),
--   FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(id),
--   FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id),
--   FOREIGN KEY (message_id) REFERENCES aquest_schema.MESSAGE(id)
-- );

-- CREATE TABLE aquest_schema.VOTE_TOPIC(
--   id                  BIGSERIAL PRIMARY KEY,
--   author_id           TEXT NOT NULL,
--   user_id             TEXT NOT NULL, 
--   universe_id         TEXT NOT NULL,
--   topic_id            TEXT NOT NULL,
--   content             TEXT NOT NULL,
--   created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   deleted             BOOLEAN,
--   FOREIGN KEY (author_id) REFERENCES aquest_schema.USER(id),
--   FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(id),
--   FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id),
--   FOREIGN KEY (topic_id) REFERENCES aquest_schema.UNIVERSE(id)
-- );

-- CREATE TABLE aquest_schema.GOALS(
--   id                  BIGSERIAL PRIMARY KEY,
--   rank_id             BIGINT NOT NULL,
--   content             JSON,
--   created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   FOREIGN KEY (rank_id) REFERENCES aquest_schema.RANK
-- );

-- CREATE TABLE aquest_schema.USER_UNIVERSE(
--   id                  BIGSERIAL PRIMARY KEY,
--   user_id             TEXT NOT NULL,
--   universe_id         TEXT NOT NULL,
--   created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   start_universe      BOOLEAN,
--   FOREIGN KEY (user_id) REFERENCES aquest_schema.USER(id),
--   FOREIGN KEY (universe_id) REFERENCES aquest_schema.UNIVERSE(id)
-- );

-- CREATE TABLE aquest_schema.ATOM(
--   id                  BIGSERIAL PRIMARY KEY,
--   type                TEXT NOT NULL,
--   structure           JSON,
--   created_at          TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   updated_at          TIMESTAMP WITH TIME ZONE DEFAULT now()
-- );


----------------------------------------------------
-- TRIGGER : ID GENERATION FOR UNIVERSE AND TOPIC --
----------------------------------------------------
CREATE FUNCTION aquest_schema.generate_id() 
  RETURNS trigger AS $generate_id$
  DECLARE
    new_id TEXT;
    existant TEXT;
  BEGIN
    IF (TG_TABLE_NAME = 'universe') THEN
      new_id := replace(trim(both ' ' from NEW.name), ' ', '_');
      existant := (SELECT id FROM aquest_schema.universe WHERE universe.id ~ concat('^', new_id) ORDER BY id DESC);
      IF (FOUND IS FALSE) THEN
        NEW.id := new_id;
      ELSE
      END IF;
    ELSIF (TG_TABLE_NAME = 'topic') THEN
      new_id := replace(trim(both ' ' from NEW.title), ' ', '_');
      existant := (SELECT id FROM aquest_schema.topic WHERE topic.id ~ concat('^', new_id) ORDER BY id DESC);
      IF (FOUND IS FALSE) THEN
        NEW.id := new_id;
      ELSE
      END IF;
    END IF;
    RETURN NEW;
  END;
$generate_id$ LANGUAGE plpgsql;

-- Universe
CREATE TRIGGER generate_id
  BEFORE INSERT ON aquest_schema.universe
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.generate_id();
-- Topic
CREATE TRIGGER generate_id
  BEFORE INSERT ON aquest_schema.topic
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.generate_id();


---------------------------------------------------
-- TRIGGER : CHAT CREATION FOR UNIVERSE AND TOPIC--
---------------------------------------------------
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
-- Universe
CREATE TRIGGER create_chat
  BEFORE INSERT ON aquest_schema.universe
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.create_chat_universe();
-- Topic  
CREATE TRIGGER create_chat
  BEFORE INSERT ON aquest_schema.topic
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.create_chat_topic();
  

--------------------------
-- TRIGGER : UPDATED_AT -- 
--------------------------
CREATE FUNCTION aquest_schema.set_updated_timestamp()
  RETURNS TRIGGER AS $set_updated_timestamp$
  BEGIN
    NEW.updated_at := now(); 
    RETURN NEW;
  END;
$set_updated_timestamp$ LANGUAGE plpgsql;

-- User
CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON aquest_schema.user 
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.set_updated_timestamp();
-- Universe
CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON aquest_schema.universe 
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.set_updated_timestamp();
-- Topic
CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON aquest_schema.topic 
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.set_updated_timestamp();
-- Chat
CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON aquest_schema.chat 
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.set_updated_timestamp();
-- Atomtopic
CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON aquest_schema.atomtopic 
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.set_updated_timestamp();
-- AtomMessage
CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON aquest_schema.atommessage
  FOR EACH ROW EXECUTE PROCEDURE aquest_schema.set_updated_timestamp();
  

----------------------------------------
-- FUNCTION : TOPIC w/ ATOMS CREATION --
----------------------------------------
-- automaticaly create topic and associated atoms 
CREATE OR REPLACE FUNCTION aquest_schema.create_atoms_topic(topic_id TEXT, user_id TEXT, universe_id TEXT, title TEXT, description TEXT, content TEXT) 
  RETURNS JSON AS $$
  var topic = plv8.subtransaction(function() {
    
    var insert_topic = plv8.execute( 
      'INSERT INTO aquest_schema.topic ' +
        '(id, user_id, universe_id, title, description) ' +
      'VALUES ' +
        '($1, $2, $3, $4, $5) ' + 
      'RETURNING topic.chat_id AS "chatId", topic.picture, topic.updated_at as "timestamp"',
      [topic_id, user_id, universe_id, title, description]
    );
    
    content = JSON.parse(content);
    
    for(var i = 0, content_length = content.length ; i < content_length ; i++){
      var insert_atom_topic = plv8.execute( 
        'INSERT INTO aquest_schema.atomtopic ' +
          '(topic_id, type, content, position) ' +
        'VALUES ' + 
          '($1, $2, $3, $4)',
        [topic_id, content[i]['type'], content[i], i] 
      );
      -- plv8.elog(NOTICE, "resultat requête = ", insert_atom_topic);
      i++;
    }
    
    return {id: topic_id, author: user_id, universeId: universe_id, title: title, description: description, picture: insert_topic[0].picture, timestamp: insert_topic[0].timestamp, chatId: insert_topic[0].chatId, content: content};
  });
  return topic;
$$ LANGUAGE plv8;


----------------
-- JSON UTILS --
----------------
-- Concats an array of JSON object into JSON properties  
CREATE OR REPLACE FUNCTION aquest_schema.concat_json_array(json_array JSON)
RETURNS JSON AS $$
  var o = {};
  for (var i = 0, json_array_length = json_array.length ; i < json_array_length ; i++) {
    for (var key in json_array[i]) {
      if (json_array[i].hasOwnProperty(key)) o[key] = json_array[i][key];
    }
  }
  return o;
$$ LANGUAGE plv8 IMMUTABLE STRICT;

-- Concats two JSON objects in one JSON object
CREATE OR REPLACE FUNCTION aquest_schema.concat_json_object(obj1 JSON, obj2 JSON)
RETURNS JSON AS $$
	var o = {};
	for (var key in obj1) {
		if (obj1.hasOwnProperty(key)) o[key] = obj1[key];
	}
	for (var key in obj2) {
		if (obj1.hasOwnProperty(key)) o[key] = obj2[key];
	}
  return o;
$$ LANGUAGE plv8 IMMUTABLE STRICT;


-------------------------
-- MOCK DATA INSERTION --
-------------------------

INSERT INTO aquest_schema.user 
    (email, id, first_name, last_name, password_hash, creation_ip) 
  VALUES 
    ('admin@aquest.tech', 'admin', 'Aquest', 'Technologies', '$2a$10$m3jpaE2uelYFzoPTu/fG/eU5rTkmL0d8ph.eF3uQrdQE46UbhhpdW', '192.168.0.1');

-- INSERT INTO aquest_schema.user 
--     (email, id, first_name, last_name, password_salt, password_hash, creation_ip) 
--   VALUES 
--     ('johndoe@gmail.com', 'johnDoe', 'John', 'Doe', 'fsfgfdgsdfgsdfokoksqlsd', 'dskjfsdkfjks', '192.168.0.1');

-- INSERT INTO aquest_schema.universe 
--     (id, name, user_id, description, picture) 
--   VALUES 
--     ('Startups', 'Startups', 'johnDoe', 'This is the description of the Startups universe', 'img/pillars_compressed.png');
    
-- INSERT INTO aquest_schema.universe 
--     (id, name, user_id, description, picture) 
--   VALUES 
--     ('Design', 'Design', 'johnDoe', 'This is the description of the Design Universe', 'img/designer_compressed.png');
    
-- INSERT INTO aquest_schema.topic 
--     (id, user_id, universe_id, title) 
--   VALUES 
--     ('AquestTechnologies', 'johnDoe', 'Startups', 'Aquest Technologies');
    
-- INSERT INTO aquest_schema.topic 
--     (id, user_id, universe_id, title) 
--   VALUES 
--     ('DavidEtAugustin', 'johnDoe', 'Startups', 'David et Augustin');
    
-- INSERT INTO aquest_schema.atom 
--   (type,structure) 
-- VALUES 
--   ('text','{"text":"^[A-Za-z][0-9]+$"}');

-- INSERT INTO aquest_schema.message 
--   (user_id,chat_id) 
-- VALUES 
--   ('johnDoe','1');

-- INSERT INTO aquest_schema.atom_message 
--   (atom_id, message_id, type, content) 
-- VALUES 
--   (1, 1,'text','{"text":"hello"}');
  
-- INSERT INTO aquest_schema.atom_topic 
--   (atom_id, topic_id, type, content, position) 
-- VALUES 
--   (1,'AquestTechnologies','text','{"text":"Topic about nothing"}',0);

-- INSERT INTO aquest_schema.atom_topic 
--   (atom_id, topic_id, type, content, position) 
-- VALUES 
--   (1,'AquestTechnologies','text','{"text":"WITH NOTHING !!!"}',1);
