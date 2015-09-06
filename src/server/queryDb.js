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
      console.log(sql);
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

        sql = 
        'SELECT ' +
            'universe.id, name, universe.description, picture, chat_id "chatId", rules, ' +
            `array_agg(json_build_object('id', ballot.id,'content', ballot.content, 'value',ballot.value, 'position', ballot.position, 'description', ballot.description)) ballot ` +
        'FROM aquest_schema.universe, (SELECT * FROM aquest_schema.ballot ORDER BY position) ballot, aquest_schema.ballot_universe ' +
        'WHERE ballot_universe.universe_id = universe.id AND ballot_universe.ballot_id = ballot.id ' +
        'GROUP BY universe.id';
        
        callback = result => result.rows;
        
        break;
        
        
      case 'readUniverse':
          
        sql = 
        'SELECT ' +
            'universe.id, name, universe.description, picture, chat_id "chatId", rules, ' +
             `array_agg(json_build_object('id', ballot.id,'content', ballot.content, 'value',ballot.value, 'position', ballot.position, 'description', ballot.description)) ballot ` +
        'FROM aquest_schema.universe, (SELECT * FROM aquest_schema.ballot ORDER BY position) ballot, aquest_schema.ballot_universe ' +
        'WHERE universe_id = $1 AND ballot_universe.universe_id = universe.id AND ballot_universe.ballot_id = ballot.id ' +
        'GROUP BY universe.id';
        
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
        
        sql =
        'SELECT ' +
          `json_build_object('id', chat.id, 'name', chat.name, ` +
           `'firstMessageId', (SELECT id FROM aquest_schema.atommessage WHERE chat_id = $1 ORDER BY id ASC LIMIT 1), ` +
           `'messages', array_agg(CASE WHEN atommessage.message IS NULL THEN '[]'::JSON ELSE atommessage.message END) ` +
          ') as chat ' +
        'FROM ' +
          'aquest_schema.chat ' +
          'LEFT JOIN ' +
            '(SELECT * FROM (SELECT ' +
        	    'atommessage.id, atommessage.chat_id, ' +
        	    `json_build_object('id', atommessage.id, ` +
        	    `'user_id',atommessage.user_id,'type', atommessage.type,'content', atommessage.content,'createdAt', atommessage.created_at,` +
        	    `'vote',COALESCE(ballot_message.vote::jsonb, '{}'::jsonb)) message ` +
              'FROM ' +
              'aquest_schema.atommessage ' +
                'LEFT JOIN ' +
                '(SELECT ' +
                  `ballot_message.message_id, json_object(array_agg(ballot.content), array_agg(ballot_message.user_ballot::TEXT)) vote ` +
                'FROM ' +
                  '(SELECT id FROM aquest_schema.universe WHERE chat_id = $1) universe, ' +
                  `(SELECT message_id, ballot_id, universe_id, json_agg(json_build_object('author', author_id, 'userId', user_id, 'updatedAt', updated_at)) user_ballot ` +
                  'FROM aquest_schema.ballot_message GROUP BY message_id, ballot_id, universe_id) AS ballot_message ' +
                  'LEFT JOIN ' +
                    'aquest_schema.ballot ' + 
                  'ON ballot_message.ballot_id = ballot.id ' +
                  'WHERE ballot_message.universe_id = universe.id ' +
                  'GROUP BY ballot_message.message_id) ballot_message ' +
                'ON atommessage.id = ballot_message.message_id ' +
              'WHERE atommessage.chat_id = $1 ' +
              'GROUP BY atommessage.id, atommessage.chat_id, ballot_message.vote::jsonb ' +
              `ORDER BY atommessage.id DESC OFFSET $2 LIMIT ${nbrChatMessages}) atommessagedesc ` +
            'ORDER BY id ASC) AS atommessage ' + 
          'ON chat.id = atommessage.chat_id ' +
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
        
        sql =
        'SELECT ' +
          `json_build_object('id', chat.id, 'name', chat.name, ` +
           `'firstMessageId', (SELECT id FROM aquest_schema.atommessage WHERE chat_id = $1 ORDER BY id ASC LIMIT 1), ` +
           `'messages', array_agg(CASE WHEN atommessage.message IS NULL THEN '[]'::JSON ELSE atommessage.message END)  ` +
          ') as chat ' +
        'FROM ' +
          'aquest_schema.chat ' +
          'LEFT JOIN ' +
            '(SELECT * FROM (SELECT ' +
              'atommessage.id, atommessage.chat_id, ' +
              `json_build_object('id', atommessage.id, ` +
              `'user_id',atommessage.user_id,'type', atommessage.type,'content', atommessage.content,'createdAt', atommessage.created_at,'vote', ` +
              `COALESCE(ballot_message.vote::jsonb, '{}'::jsonb)) message ` +
              'FROM ' +
              'aquest_schema.atommessage ' +
                'LEFT JOIN ' +
                '(SELECT ' +
                  `ballot_message.message_id, json_object(array_agg(ballot.content), array_agg(ballot_message.user_ballot::TEXT)) vote ` +
                'FROM ' +
                  '(SELECT id FROM aquest_schema.universe WHERE chat_id = $1) universe, ' +
                  `(SELECT message_id, ballot_id, universe_id, json_agg(json_build_object('author', author_id, 'userId', user_id, 'updatedAt', updated_at)) user_ballot ` +
                  'FROM aquest_schema.ballot_message GROUP BY message_id, ballot_id, universe_id) AS ballot_message ' +
                  'LEFT JOIN ' +
                    'aquest_schema.ballot ' +
                  'ON ballot_message.ballot_id = ballot.id ' +
                  'WHERE ballot_message.universe_id = universe.id ' +
                  'GROUP BY ballot_message.message_id) ballot_message ' +
                'ON atommessage.id = ballot_message.message_id ' +
              'WHERE atommessage.chat_id = $1 ' +
              'GROUP BY atommessage.id, atommessage.chat_id, ballot_message.vote::jsonb ' +
              `ORDER BY atommessage.id DESC LIMIT ${nbrChatMessages}) atommessagedesc ` + //limit doesn't work cuz this query supose that message_id are incrementale...
            'ORDER BY id ASC) AS atommessage ' +
          'ON chat.id = atommessage.chat_id ' +
          'WHERE chat.id = $1 GROUP BY chat.id';
        
        paramaterized = [params];
        
        callback = result => {
          if (result.rows[0]) {
            const { chat } = result.rows[0];
            console.log(chat);
            if (!chat.messages[0].content) chat.messages = [];
            
            return chat;
          }
        };
        
        break;
        
        
      case 'readInventory':
        
        sql =
        'SELECT ' +
          'topic.id, title, topic.universe_id "universeId", topic.user_id "userId", ' +
          'preview_type "previewType", preview_content::jsonb "previewContent", topic.created_at "createdAt", topic.chat_id "chatId", ' +
          `CASE WHEN ballot_topic.vote::jsonb IS NULL THEN '[]'::jsonb ELSE ballot_topic.vote::jsonb END ` +
        'FROM ' +
          'aquest_schema.topic ' +
          'LEFT JOIN ' +
          '(SELECT ' +
            `ballot_topic.topic_id, json_object_agg(ballot_topic.content, CASE WHEN ballot_topic.user_ballot IS NULL THEN ARRAY[]::JSON[] ELSE ballot_topic.user_ballot END ` +
          ') AS vote ' +
          'FROM ' +
            '(SELECT ' +
              `ballot_topic.topic_id, ballot.content, array_agg(json_build_object('author', author_id, 'userId', user_id, 'updatedAt', updated_at)) user_ballot ` + 
            'FROM ' +
              'aquest_schema.ballot_topic, aquest_schema.ballot ' +
            'WHERE ' +
              'ballot.id = ballot_topic.ballot_id AND universe_id = $1 ' +
            'GROUP BY topic_id, ballot.id) ballot_topic ' + 
            'GROUP BY ballot_topic.topic_id, ballot_topic.content) ballot_topic ' +
          'ON topic.id = ballot_topic.topic_id ' +
        'GROUP BY topic.id, title, universe_id, user_id, preview_type, preview_content::jsonb, created_at, chat_id, ballot_topic.vote::jsonb ';
          
        paramaterized = [params];
        callback = result => { 
          if (result.rows) {
            console.log(result.rows);
            return result.rows;
          }
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
