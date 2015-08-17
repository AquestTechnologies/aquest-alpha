import pg from 'pg';
import log from '../shared/utils/logTailor.js';
import devConfig from '../../config/development.js';

export default function queryDb(intention, params) {
  
  const d = new Date();
  const {user, password, host, port, database} = devConfig().pg;
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
    
    const {id, userId, universeId, title, chatId, atoms, content, name, description, previewType, previewContent, pseudo, email, passwordHash, ip, picture} = 
      typeof params === 'object' && !(params instanceof Array) ? params : {};
    
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
        
        
      case 'readChat':
        
        sql =
        'SELECT ' +
          'json_build_object(' + 
            `'id', chat.id,` + 
            `'name', chat.name,` + 
            `'messages', array_agg(` + 
              'json_build_object(' + 
                `'userId', aquest_user.id,` + 
                `'type', atommessage.type,` +
                `'content', atommessage.content,` +
                `'createdAt', atommessage.created_at` +
              ')' + 
            ')' + 
          ') as chat ' +
        'FROM ' +
          'aquest_schema.chat ' +
        'LEFT JOIN aquest_schema.atommessage atommessage ON chat.id = atommessage.chat_id ' +
        'LEFT JOIN aquest_schema.user aquest_user ON atommessage.user_id = aquest_user.id ' +
        'WHERE chat.id = $1 GROUP BY chat.id';
        
        paramaterized = [params];
        callback = result => {
          const { chat } = result.rows[0];
          if (chat.messages[0].content === null) chat.messages = [];
          return chat;
        };
        
        break;
        
        
      case 'readInventory':
          
        sql =
        'SELECT ' + 
          `id, title, universe_id "universeId", user_id "userId", preview_type "previewType", preview_content "previewContent", COALESCE(to_char(created_at, 'MM-DD-YYYY HH24:MI:SS'), '') "createdAt", chat_id "chatId" ` +
        'FROM ' +    
          'aquest_schema.topic ' +
        'WHERE ' + 
          'topic.universe_id = $1';
        
        paramaterized = [params];
        callback = result => result.rows;
        
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
          `'createdAt', COALESCE(to_char(created_at, 'MM-DD-YYYY HH24:MI:SS'), ''),` + 
          `'atoms', array_agg(` + 
            'json_build_object(' + 
              `'type', atomtopic.type,` +
              `'content', atomtopic.content,` +
            ')' + 
          ')' + 
        ') as topic ' +
        'FROM aquest_schema.topic ' +
        'WHERE topic.id = $1 ' +
        'LEFT JOIN aquest_schema.atomtopic atomtopic ON topic.id = atomtopic.topic_id ' +
        'ORDER BY atomtopic.position';
        
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
        
        
      case 'randomRow':
        
        sql = `SELECT * FROM aquest_schema.${params} ORDER BY RANDOM() LIMIT 1`;
        
        callback = result => result.rows[0];
        
        break;
    }
    
    return {sql, callback, paramaterized};
  }
}
