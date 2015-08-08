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
    
    const {id, userId, universeId, title, chatId, messageContent, name, description, pseudo, email, passwordHash, passwordSalt, ip, content, picture} = 
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
                `'id', atommessage.id,` + 
                `'chatId', chat.id,` + 
                `'userId', aquest_user.id,` + 
                `'type', atommessage.type,` +
                `'content', atommessage.content,` +
                `'createdAt', atommessage.created_at` +
              ')' + 
            ')' + 
          ') as chat ' +
        'FROM ' +
          'aquest_schema.chat ' +
        'LEFT JOIN aquest_schema.atommessage ON chat.id = atommessage.chat_id ' +
        'LEFT JOIN aquest_schema.user aquest_user ON atommessage.user_id = aquest_user.id ' +
        'WHERE chat.id = $1 GROUP BY chat.id';
        
        paramaterized = [params];
        callback = result => result.rows[0].chat;
        
        break;
        
        
      case 'readInventory':
          
        sql =
        'SELECT ' + 
          'id, title, universe_id "universeId", user_id "userId", description, created_at "createdAt", chat_id "chatId" ' +
        'FROM ' +    
          'aquest_schema.topic ' +
        'WHERE ' + 
          'topic.universe_id = $1';
        
        paramaterized = [params];
        callback = result => result.rows;
        
        break;  
        
        
      case 'readTopic':
        
        sql =
        'SELECT ' +
          'id, title, universe_id "universeId", user_id "userId", description, created_at "createdAt", chat_id "chatId" ' +
        'FROM '+
          'aquest_schema.topic ' +
        'WHERE ' + 
          'topic.id = $1';
        
        paramaterized = [params];
        callback = result => result.rows[0];
        
        break;
      
      
      case 'readTopicContent':
        // atomTopicId, content, ordered, deleted, topicId, atomId
        
        sql = 
        'SELECT ' +
          'array_to_json(' +
            'array_agg(' +
              'aquest_schema.concat_json_object(' +
                'atomtopics.content, json_build_object(' +
                  `'type',atomtopics.type` +
                ')' +
              ')' +
            ')' +
          ') AS content ' +
        'FROM ' +
          '(SELECT ' +
        		'atomtopic.content, atomtopic.type ' +
        	'FROM ' +
        		'aquest_schema.atomtopic ' +
        	'WHERE ' +
        		'atomtopic.topic_id = $1 ' + 	
        	'ORDER BY ' + 
        		'atomtopic.position' +
        	') atomtopics';
        
        paramaterized = [params];
        callback = result => result.rows[0].content;
        
        break;
        
        
      case 'createMessage':
        // atomTopicId, content, ordered, deleted, topicId, atomId
        
        sql = 
        'INSERT INTO aquest_schema.atommessage ' +
          '(chat_id, user_id, type, content) ' +
        'VALUES' +
          '($1, $2, $3, $4) ' +
        "RETURNING json_build_object('id', id, 'chatId', chat_id, 'type', type, 'content', content) AS createdMessage";
        
        paramaterized = [chatId, userId, 'text', JSON.stringify(messageContent)];
        callback = result => result.rows[0].createdMessage;
        
        break;
        
        
      case 'createUniverse':
        // id, universe1Id, universe2Id, force, createdAt, updatedAt, deleted
        
        sql = 
        'INSERT INTO aquest_schema.universe ' +
          '(name, user_id, description, picture, creation_ip) ' +
        'VALUES ' +
          '($1, $2, $3, $4, $5) ' +
        `RETURNING json_build_object('id', id, 'chatId', chat_id, 'name', name, 'description', description, 'picture', picture, 'rules', rules) AS "createdUniverse"`;
        
        paramaterized = [name, userId, description, picture, ip];
        callback = result => result.rows[0].createdUniverse;
        
        break;
        
        
      case 'createTopic':
        //topic : id, user_id, chat_id, universe_id, title, handle, created_at, updated_at
        //atomtopic : id; atom_id, topic_id, content, order, created_at, updated_at
        
        sql = 
        'SELECT ' + 
          'aquest_schema.create_atoms_topic(' + 
            '$1 ::TEXT, $2 ::TEXT, $3 ::TEXT, $4 ::TEXT, $5 ::TEXT, $6 ::TEXT' +
          ') AS create_topic';
        
        paramaterized = [id, userId, universeId, title, description, JSON.stringify(content)];
        callback = result => result.rows[0].create_topic;
        
        break;
        
        
      case 'createUser':
        
        sql = 
        'INSERT INTO aquest_schema."user" ' +
          '(id, email, password_hash, creation_ip) ' +
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
