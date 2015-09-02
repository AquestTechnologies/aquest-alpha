import pg from 'pg';
import log from '../shared/utils/logTailor';
import devConfig from '../../config/dev_server';

export default function queryDb(intention, params) {
  
  const d = new Date();
  const { user, password, host, port, database } = devConfig.pg;
  const connectionString = `postgres://${user}:${password}@${host}:${port}/${database}`;
  
  return new Promise((resolve, reject) => {
    
    /**
     * Description : Update queryDb to fit node-postgres "best practise" - Execution handle reconnexion and use polling - https://github.com/brianc/node-postgres/wiki/pg
     * ToDo : use the pg object to create pooled clients, build our own client pool implementation or use https://github.com/grncdr/node-any-db
     * */
    pg.connect(connectionString, (err, client, done) => { 
      if (err) throw err;
      
      const {sql, paramaterized, callback} = buildQuery(intention, params); // Query construction
      if (sql) client.query(sql, paramaterized, (err, result) => {
        done();
        if (err) return reject(err);
        log(`+++ <-- ${intention} : `, result.rowCount ? `${result.rowCount}rows` : 'nothing', ` after ${new Date() - d}ms`);
        resolve(typeof callback === 'function' ? callback(result) : result);
      });
      else reject(`queryDb.buildQuery did not produce any SQL, check your intention: ${intention}`);
    });
  });
  
  
  // Builds the SQL query and optionnal callback
  function buildQuery(intention, params) {
    
    const {id, userId, universeId, title, chatId, offset, atoms, content, name, description, previewType, previewContent, pseudo, email, passwordHash, ip, picture, url} = 
      typeof params === 'object' && !(params instanceof Array) ? params : {};
      
    // define the maximum number of message to load
    const nbrChatMessages = 30;
    
    let sql, callback, paramaterized;
    
    switch (intention) {
      
      
      case 'readUniverses':
        // sql = 'SELECT id, name, description, picture, chat_id FROM aquest_schema.universe';
        sql = 
        'SELECT ' + 
          'id, name, description, picture, chat_id "chatId", rules ' +
        'FROM ' + 
          'aquest_schema.universe';
        
        callback = result => result.rows;
        
        break;
        
        
      case 'readUniverse':
        
        sql = 
        'SELECT ' + 
          'id, name, description, picture, chat_id "chatId" ' +
        'FROM ' +
          'aquest_schema.universe ' +
        'WHERE ' +
          'id = $1';
        
        paramaterized = [params];
        callback = result => result.rows[0];
          
        break;
        
        
      case 'readUniverseWithTopics':
        
        sql =
        'SELECT ' + 
          'aquest_schema.concat_json_object(' +
            'to_json(universe),' +
            `json_build_object('topics',` +
              'array_agg(' + 
                'json_build_object(' +
                  `'id',topics.id,` +
                  `'title',topics.title,` +
                  `'universeId',topics.universe_id,` +
                  `'author',topics.user_id,` +
                  `'timestamp',topics.updated_at,` +
                  `'chatId',topics.chat_id` +
                ')' + 
              ')' +
            ')' +
          ') as "UniverseWithTopics"' +   
        'FROM (' +
          'SELECT ' +    
            'universe, topic.* ' +
          'FROM' +   
            '(SELECT universe.id, universe.name, universe.description, universe.picture, universe.chat_id "chatId" FROM aquest_schema.universe WHERE universe.id = $1) universe ' +  
            'LEFT JOIN aquest_schema.topic ON universe.id = topic.universe_id ' +
        ') topics GROUP BY universe';
        
        paramaterized = [params];
        callback = result => result.rows[0].UniverseWithTopics;
        
        break;
        
        
      case 'readChatOffset':
        
        // sql = 
        // 'SELECT ' +
        //   'json_build_object(' + 
        //     `'id', chat.id,` + 
        //     `'name', chat.name,` + 
        //     `'messages', array_agg(` + 
        //       'json_build_object(' + 
        //         `'id', atommessage.id,` +
        //         `'userId', aquest_user.id,` + 
        //         `'type', atommessage.type,` +
        //         `'content', atommessage.content,` +
        //         `'createdAt', atommessage.created_at` +
        //       ')' + 
        //     ')' + 
        //   ') as chat ' +
        // 'FROM ' +
        //   'aquest_schema.chat ' +
        // `LEFT JOIN (SELECT * FROM (SELECT * from aquest_schema.atommessage ORDER BY id DESC OFFSET $2 LIMIT ${nbrChatMessages}) atommessagedesc ORDER BY id ASC) AS atommessage ON chat.id = atommessage.chat_id ` +
        // 'LEFT JOIN aquest_schema.user aquest_user ON atommessage.user_id = aquest_user.id ' +
        // 'WHERE chat.id = $1 GROUP BY chat.id';
        
        sql = 
        'SELECT ' +
          'json_build_object( ' +
            `'id', chat.id,` +
            `'name', chat.name,` + 
            `'firstMessageId', (SELECT id FROM aquest_schema.atommessage WHERE atommessage.chat_id = $1 ORDER BY id ASC LIMIT 1),` +
            `'messages', array_agg(atommessage.message)) as chat ` +
        'FROM ' +
          'aquest_schema.chat ' + 
          'LEFT JOIN ' +
          '(SELECT * FROM ' +
            '(SELECT ' +
              'atommessage.id id, ' +
              'atommessage.chat_id chat_id, ' +
              'atommessage.user_id user_id, ' +
              'json_build_object(' +
                `'id', atommessage.id,` +
                `'type', atommessage.type,` +
                `'content', atommessage.content,` +
                `'createdAt', atommessage.created_at,` +
                `'vote', json_object_agg(ballot_message.content, ballot_message.users) ` +
              ') message ' +
            'FROM ' +
              'aquest_schema.atommessage, ' +
              '((SELECT ' +
                `atommessage.id, atommessage.content, json_build_object('value', atommessage.value, 'users', '[]'::jsonb)::jsonb users ` +
              'FROM ' +
                '(SELECT ' +
                  'atommessage.id, ballot_universe.content, ballot_universe.value '+ 
                'FROM ' +
                  '(SELECT universe_id, content, value FROM aquest_schema.ballot, aquest_schema.ballot_universe WHERE ballot.id = ballot_universe.ballot_id) ballot_universe, ' +
                  'aquest_schema.atommessage, ' +
                  '(SELECT id FROM aquest_schema.universe WHERE chat_id = $1) universe ' + 
                'WHERE ballot_universe.universe_id = universe.id AND atommessage.chat_id = $1 ' +
                'EXCEPT ' +
                  'SELECT ' +
                    'atommessage.id, ballot.content, ballot.value ' +
                  'FROM ' +
                    '(SELECT id FROM aquest_schema.universe WHERE chat_id = $1) universe, ' +
                    'aquest_schema.atommessage, aquest_schema.ballot, aquest_schema.ballot_message ' +
                  'WHERE ' +
                    'ballot_message.universe_id = universe.id AND atommessage.id = ballot_message.message_id AND ballot_message.ballot_id = ballot.id ' +
                ') AS atommessage) ' +
              'UNION ' +
                '(SELECT ' +
                  `ballot_message.message_id, ballot.content, json_agg(aquest_schema.concat_json_object(json_build_object('value', ballot.value),ballot_message.user_ballot))::jsonb users ` +
                'FROM ' +
                  '(SELECT id FROM aquest_schema.universe WHERE chat_id = $1) universe, ' +
                  `(SELECT message_id, ballot_id, universe_id, json_build_object('author', author_id, 'userId', user_id, 'updatedAt', updated_at) user_ballot FROM aquest_schema.ballot_message) AS ballot_message ` +
                'LEFT JOIN ' +
                  'aquest_schema.ballot ' +
                'ON ballot_message.ballot_id = ballot.id ' +
                'WHERE ballot_message.universe_id = universe.id ' +
                'GROUP BY ballot_message.message_id, ballot.content) ' +
              ') ballot_message ' +
            'WHERE atommessage.id = ballot_message.id ' +
            'GROUP BY atommessage.id ' +
            `ORDER BY id DESC OFFSET $2 LIMIT ${nbrChatMessages}) atommessagedesc ORDER BY id ASC) atommessage ` + 
          'ON chat.id = atommessage.chat_id ' +
        'LEFT JOIN aquest_schema.user aquest_user ON atommessage.user_id = aquest_user.id ' +
        'WHERE chat.id = $1 GROUP BY chat.id';
          
         
          
        paramaterized = [chatId, offset];
        
        callback = result => {
          if (result.rows[0]) {
            const { chat } = result.rows[0];
            console.log(chat);
            if (!chat.messages[0].content) chat.messages = [];
            
            return chat;
          }
        };
        
        break;
        
      case 'readChat':
        
        // sql = 
        // 'SELECT ' +
        //   'json_build_object(' + 
        //     `'id', chat.id,` + 
        //     `'name', chat.name,` + 
        //     `'firstMessageId', (SELECT id FROM aquest_schema.atommessage WHERE atommessage.chat_id = $1 ORDER BY id ASC LIMIT 1),` +
        //     `'messages', array_agg(` + 
        //       'json_build_object(' + 
        //         `'id', atommessage.id,` +
        //         `'userId', aquest_user.id,` + 
        //         `'type', atommessage.type,` +
        //         `'content', atommessage.content,` +
        //         `'createdAt', atommessage.created_at` +
        //       ')' + 
        //     ')' +
        //   ') as chat ' +
        // 'FROM ' +
        //   'aquest_schema.chat ' +
        // `LEFT JOIN (SELECT * FROM (SELECT * from aquest_schema.atommessage ORDER BY id DESC LIMIT ${nbrChatMessages}) atommessagedesc ORDER BY id ASC) AS atommessage ON chat.id = atommessage.chat_id ` +
        // 'LEFT JOIN aquest_schema.user aquest_user ON atommessage.user_id = aquest_user.id ' +
        // 'WHERE chat.id = $1 GROUP BY chat.id';
        
        sql =
        'SELECT ' +
          'json_build_object( ' +
            `'id', chat.id,` +
            `'name', chat.name,` + 
            `'firstMessageId', (SELECT id FROM aquest_schema.atommessage WHERE atommessage.chat_id = $1 ORDER BY id ASC LIMIT 1),` +
            `'messages', array_agg(atommessage.message)) as chat ` +
        'FROM ' +
          'aquest_schema.chat ' + 
          'LEFT JOIN ' +
          '(SELECT * FROM ' +
            '(SELECT ' +
              'atommessage.id id, ' +
              'atommessage.chat_id chat_id, ' +
              'atommessage.user_id user_id, ' +
              'json_build_object(' +
                `'id', atommessage.id,` +
                `'type', atommessage.type,` +
                `'content', atommessage.content,` +
                `'createdAt', atommessage.created_at,` +
                `'vote', json_object_agg(ballot_message.content, ballot_message.users) ` +
              ') message ' +
            'FROM ' +
              'aquest_schema.atommessage, ' +
              '((SELECT ' +
                `atommessage.id, atommessage.content, json_build_object('value', atommessage.value, 'users', '[]'::jsonb)::jsonb users ` +
              'FROM ' +
                '(SELECT ' +
                  'atommessage.id, ballot_universe.content, ballot_universe.value '+ 
                'FROM ' +
                  '(SELECT universe_id, content, value FROM aquest_schema.ballot, aquest_schema.ballot_universe WHERE ballot.id = ballot_universe.ballot_id) ballot_universe, ' +
                  'aquest_schema.atommessage, ' +
                  '(SELECT id FROM aquest_schema.universe WHERE chat_id = $1) universe ' + 
                'WHERE ballot_universe.universe_id = universe.id AND atommessage.chat_id = $1 ' +
                'EXCEPT ' +
                  'SELECT ' +
                    'atommessage.id, ballot.content, ballot.value ' +
                  'FROM ' +
                    '(SELECT id FROM aquest_schema.universe WHERE chat_id = $1) universe, ' +
                    'aquest_schema.atommessage, aquest_schema.ballot, aquest_schema.ballot_message ' +
                  'WHERE ' +
                    'ballot_message.universe_id = universe.id AND atommessage.id = ballot_message.message_id AND ballot_message.ballot_id = ballot.id ' +
                ') AS atommessage) ' +
              'UNION ' +
                '(SELECT ' +
                  `ballot_message.message_id, ballot.content, json_agg(aquest_schema.concat_json_object(json_build_object('value', ballot.value),ballot_message.user_ballot))::jsonb users ` +
                'FROM ' +
                  '(SELECT id FROM aquest_schema.universe WHERE chat_id = $1) universe, ' +
                  `(SELECT message_id, ballot_id, universe_id, json_build_object('author', author_id, 'userId', user_id, 'updatedAt', updated_at) user_ballot FROM aquest_schema.ballot_message) AS ballot_message ` +
                'LEFT JOIN ' +
                  'aquest_schema.ballot ' +
                'ON ballot_message.ballot_id = ballot.id ' +
                'WHERE ballot_message.universe_id = universe.id ' +
                'GROUP BY ballot_message.message_id, ballot.content) ' +
              ') ballot_message ' +
            'WHERE atommessage.id = ballot_message.id ' +
            'GROUP BY atommessage.id ' +
            `ORDER BY atommessage.id DESC LIMIT ${nbrChatMessages}) message_vote ORDER BY message_vote.id ASC) atommessage ` +
          'ON chat.id = atommessage.chat_id ' +
        'LEFT JOIN aquest_schema.user aquest_user ON atommessage.user_id = aquest_user.id ' +
        'WHERE chat.id = $1 GROUP BY chat.id';
          
        paramaterized = [params];
        
        callback = result => {
          if (result.rows[0]) {
            const { chat } = result.rows[0];
            if (!chat.messages[0].content) chat.messages = [];
            
            return chat;
          }
        };
        
        break;
        
        
      case 'readInventory':
          
        // sql =
        // 'SELECT ' + 
        //   `id, title, universe_id "universeId", user_id "userId", preview_type "previewType", preview_content "previewContent", COALESCE(to_char(created_at, 'MM-DD-YYYY HH24:MI:SS'), '') "createdAt", chat_id "chatId", ` +
        // 'FROM ' +    
        //   'aquest_schema.topic ' +
        // 'WHERE ' + 
        //   'topic.universe_id = $1';
        sql =  
        'SELECT ' +
          `topic.id, title, universe_id "universeId", user_id "userId", preview_type "previewType", preview_content "previewContent", COALESCE(to_char(created_at, 'MM-DD-YYYY HH24:MI:SS'), '') "createdAt", chat_id "chatId",` +
          `json_object_agg(ballot_topic.content, ballot_topic.users::json) vote ` +
        'FROM ' +
          'aquest_schema.topic, ' +
          '((SELECT ' + 
            `topic.id, topic.content, json_build_object('value',topic.value, 'users', '[]'::jsonb)::jsonb users ` +
          'FROM ' +
            '(SELECT ' + 
              'topic.id, ballot_universe.content, ballot_universe.value ' +
            'FROM ' +
              '(SELECT universe_id, content, value FROM aquest_schema.ballot, aquest_schema.ballot_universe WHERE ballot.id = ballot_universe.ballot_id) ballot_universe, ' +
              'aquest_schema.topic ' +
            `WHERE topic.universe_id = $1 AND ballot_universe.universe_id = topic.universe_id ` +
            'EXCEPT ' +
              'SELECT ' +
                'topic.id, ballot.content, ballot.value ' +
              'FROM ' + 
                'aquest_schema.topic, ' +
                'aquest_schema.ballot, ' +
                'aquest_schema.ballot_topic ' + 
              'WHERE ' +
                `topic.universe_id = $1 AND topic.id = ballot_topic.topic_id AND ballot.id = ballot_topic.ballot_id ` +
            ') AS topic) ' +
          'UNION ' +
            '(SELECT ' +
              `ballot_topic.topic_id, ballot.content, json_agg(aquest_schema.concat_json_object(json_build_object('value', ballot.value),ballot_topic.user_ballot))::jsonb users ` +
            'FROM ' +
              `(SELECT topic_id, ballot_id, universe_id, json_build_object('author', author_id, 'userId', user_id, 'updatedAt', updated_at) user_ballot FROM aquest_schema.ballot_topic) AS ballot_topic ` +
            'LEFT JOIN ' +
              'aquest_schema.ballot ' +
            'ON ballot_topic.ballot_id = ballot.id ' +
            'WHERE ballot_topic.universe_id = $1 ' +
            'GROUP BY ballot_topic.topic_id, ballot.content) ' +
          ') ballot_topic ' +
        'WHERE topic.id = ballot_topic.id ' +
        'GROUP BY topic.id';
        
        paramaterized = [params];
        callback = result => { 
          if (result.rows) return result.rows;
        };
        
        break;  
        
        
      case 'readTopic':
        
        sql =
        'SELECT json_build_object(' +
          `'id', topic.id,` +
          `'userId', topic.user_id,` +
          `'chatId', topic.chat_id,` +
          `'universeId', topic.universe_id,` +
          `'title', topic.title,` +
          `'previewContent', topic.preview_content,` +
          `'previewType', topic.preview_type,` +
          `'createdAt', COALESCE(to_char(topic.created_at, 'MM-DD-YYYY HH24:MI:SS'), ''),` +
          `'atoms', atomtopic.atoms` +
        ') as topic ' +
        'FROM aquest_schema.topic ' +
        'LEFT JOIN ' +
          '(SELECT ' +
            'atomtopic.topic_id, ' +
            'array_agg(' +
              'json_build_object(' +
                `'type', atomtopic.type,` +
                `'content', atomtopic.content` +
              ') ' +
              'ORDER BY atomtopic.position ' +
            ') as atoms ' +
          'FROM aquest_schema.atomtopic ' +
          'GROUP BY atomtopic.topic_id' +
          ') as atomtopic ' +
        'ON topic.id = atomtopic.topic_id ' +
        'WHERE topic.id = $1';
        
        paramaterized = [params];
        callback = result => result.rows[0].topic;
        
        break;
      
      
      case 'readTopicAtoms':
        
        // sql = 
        // 'SELECT ' +
        //   'json_build_object(' +
        //     'array_agg(' +
        //       'json_build_object(' +
        //         `'type', atomtopic.type,` +
        //         `'content', atomtopic.content,` +
        //       ')' +
        //     ')' +
        //   ') AS atoms ' +
        // 'FROM ' +
        //   '(SELECT ' +
        // 		'atomtopic.content, atomtopic.type ' +
        // 	'FROM ' +
        // 		'aquest_schema.atomtopic ' +
        // 	'WHERE ' +
        // 		'atomtopic.topic_id = $1 ' + 	
        // 	'ORDER BY ' + 
        // 		'atomtopic.position' +
        // 	') atomtopics';
        
        sql =
        'SELECT ' +
          'type, content ' +
        'FROM ' +
          'aquest_schema.atomtopic ' +
        'WHERE ' +
          'atomtopic.topic_id = $1 ' + 
        'ORDER BY ' + 
      		'atomtopic.position';
        paramaterized = [params];
        callback = result => result.rows;
        
        break;
        
        
      case 'createMessage':
        // atomTopicId, content, ordered, deleted, topicId, atomId
        
        sql = 
        'INSERT INTO aquest_schema.atommessage ' +
          '(chat_id, user_id, type, content) ' +
        'VALUES' +
          '($1, $2, $3, $4) ' +
        "RETURNING json_build_object('id', id, 'chatId', chat_id, 'type', type, 'content', content) AS message";
        
        paramaterized = [chatId, userId, 'text', JSON.stringify(content)];
        callback = result => result.rows[0].message;
        
        break;
        
        
      case 'createUniverse':
        
        sql = 
        'INSERT INTO aquest_schema.universe ' +
          '(name, user_id, description, picture, creation_ip) ' +
        'VALUES ' +
          '($1, $2, $3, $4, $5) ' +
        `RETURNING json_build_object('id', id, 'chatId', chat_id, 'name', name, 'description', description, 'picture', picture, 'rules', rules) AS universe`;
        
        paramaterized = [name, userId, description, picture, ip];
        callback = result => result.rows[0].universe;
        
        break;
        
        
      case 'createTopic':
        
        sql = 
        'SELECT ' + 
          'aquest_schema.create_topic($1, $2, $3, $4, $5, $6) ' +
        'AS topic';
        
        paramaterized = [userId, universeId, title, previewType, JSON.stringify(previewContent), JSON.stringify(atoms)];
        callback = result => result.rows[0].topic;
        
        break;
        
        
      case 'createUser':
        
        sql = 
        'INSERT INTO aquest_schema."user" ' +
          '(id, email, password_hash, creation_ip, picture) ' +
        'VALUES ' +
          '($1, $2, $3, $4, $5)' +
        "RETURNING json_build_object('id', id, 'email', email, 'picture', picture) AS user";
        
        paramaterized = [pseudo, email, passwordHash, ip, picture];
        callback = result => result.rows[0].user;
        
        break;
        
        
      case 'login':
        
        sql = 
        'SELECT ' +
          'id, email, bio, first_name "firstName", last_name "lastName", picture, password_hash "passwordHash"' +
        'FROM aquest_schema."user" ' +
        `WHERE "user".id = '${email}' OR "user".email = '${email}' LIMIT 1`;
        
        callback = result => result.rows[0];
        
        break;
        
      case 'createFile':
        sql = 
        'INSERT INTO aquest_schema.file ' +
          '(user_id, name, url, creation_ip) ' +
        'VALUES ' +
          '($1, $2, $3, $4)';
        
        paramaterized = [userId, name, url, ip];
        callback = result => result.rows[0];
        
        break;
        
      case 'randomRow':
        
        sql = `SELECT * FROM aquest_schema.${params} ORDER BY RANDOM() LIMIT 1`;
        
        callback = result => result.rows[0];
        
        break;
    }
    
    return {sql, callback, paramaterized};
  }
}
