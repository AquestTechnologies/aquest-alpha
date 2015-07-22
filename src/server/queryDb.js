import pg        from 'pg';
import devConfig from '../../config/development.js';
import log       from '../shared/utils/logTailor.js';

let client;

export default function queryDb(intention, params) {
  
  const d = new Date();
  
  return new Promise((resolve, reject) => {
    
    // Connection attempt
    connect().then( 
      () => {
        const {sql, paramaterized, callback} = buildQuery(intention, params); // Query construction
        
        // log(`+++ REQUETE --> ${sql}`); 
        if (sql) new Promise((resolve, reject) => {
          log(sql);
          log(paramaterized);
          client.query(sql, paramaterized, (err, result) => {
            if (err) return reject(err);
            log(result.rowCount ? `+++ <-- ${intention} : ${result.rowCount} rows after ${new Date() - d}ms` : `+++ <-- ${intention} : nothing after ${new Date() - d}ms`);
            resolve(result);
          });
        }).then(
          result => resolve(typeof callback === 'function' ? callback(result) : result),
          error => reject(error)
        );
        else reject('queryDb.buildQuery did not produce any SQL, check your intention');
      },
      error => reject(error)
    );
  });
  
  
  // Connects the current host to the remote database
  function connect() {
    if (client instanceof pg.Client) return Promise.resolve();
    
    const {user, password, host, port, database} = devConfig().pg;
    
    log(`... queryDb connecting to ${database}`);

    client = new pg.Client(`postgres://${user}:${password}@${host}:${port}/${database}`);
    
    return new Promise((resolve, reject) => {
      client.connect(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  
  
  // Builds the SQL query and optionnal callback
  function buildQuery(intention, params) {
    
    const {id, userId, universeId, title, chatId, messageContent, name, description, pseudo, email, passwordHash, passwordSalt, ip, content} = 
      typeof params === 'object' && !(params instanceof Array) ? params : {};
    
    let sql, callback, paramaterized;
    
    switch (intention) {
      
      case 'readUniverses':
        // sql = 'SELECT id, name, description, picture, chat_id FROM aquest_schema.universe';
        sql = 
        'SELECT ' + 
          'id, name, description, picture, chat_id "chatId" ' +
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
        
        /*sql = 
        'SELECT \
          message.id, aquest_user.id, atom_message.content, chat.name as chat_name \
        FROM \
          aquest_schema.message \
            RIGHT OUTER JOIN aquest_schema.chat ON chat.id = message.chat_id \
            LEFT JOIN aquest_schema.user aquest_user ON message.user_id = aquest_user.id \
            LEFT JOIN  aquest_schema.atom_message ON message.id = atom_message.message_id \
        WHERE chat.id = \'' + params + `'';*/
        
        sql =
        'SELECT ' +
          'json_build_object(' + 
            `'id', chat.id,` + 
            `'name', chat.name,` + 
            `'messages', array_agg(` + 
              'json_build_object(' + 
                `'id',message.id,` + 
                `'author',aquest_user.id,` + 
                `'content',atom_message.content` + 
              ')' + 
            ')' + 
          ') as chat ' +
        'FROM ' +
          'aquest_schema.chat ' +
            'LEFT JOIN aquest_schema.message ON chat.id = message.chat_id ' +
            'LEFT JOIN aquest_schema.user aquest_user ON message.user_id = aquest_user.id ' +
            'LEFT JOIN  aquest_schema.atom_message ON message.id = atom_message.message_id ' +
        'WHERE chat.id = $1 GROUP BY chat.id';
        
        paramaterized = [params];
        
        callback = result => result.rows[0].chat;
        
        break;
        
      case 'readInventory':
          
        /*sql = 
        'SELECT ' +  
          'array_agg(' +  
            'json_build_object(' +  
              `'id',topic.id,` +
              `'title',topic.title,` +
              `'universeId',topic.universe_id,` +
              `'author',topic.user_id,` +
              `'description',topic.description,` +
              `'picture',topic.picture,` +
              `'timestamp',topic.updated_at,` + 
              `'chatId',topic.chat_id` + 
            ')' + 
          ') as topics ' +
        'FROM ' +   
          'aquest_schema.topic, aquest_schema.universe ' +
        `WHERE universe.id = '${params}'`;*/
        
        sql =
        'SELECT ' + 
          'id, title, topic.universe_id "universeId", topic.user_id author, topic.description, topic.picture, topic.updated_at "timestamp", topic.chat_id "chatId" ' +
        'FROM ' +    
          'aquest_schema.topic ' +
        'WHERE ' + 
          'topic.universe_id = $1';
        
        paramaterized = [params];
        
        callback = result => result.rows;
        
        break;  
        
      /*case 'readTopicByHandle':
        
        // id, title, author, desc, imgPath, timestamp, handle, content, chatId
        sql = 
        'SELECT \
          topic.id, topic.title, aquest_user.id, topic.handle, atom_topic.content, topic.chat_id \
        FROM \
          aquest_schema.topic, aquest_schema.atom_topic, aquest_schema.user as aquest_user \
        WHERE handle=\'' + params + `' AND topic.id = atom_topic.topic_id AND topic.user_id = aquest_user.id';
        
        // log('+++ ' + sql.replace('',`').substring(0,29));
        callback = function(result){
          let r=result.rows[0];
          return ({
            id:          r.id, 
            title:       r.title,
            id:      r.id,
            handle:      r.handle,
            content:     r.content,
            chatId:      r.chat_id,
          });
        };
        break;*/
      
      case 'readTopic':
        
        sql =
        'SELECT ' +
          'id, title, universe_id "universeId", user_id author, description, picture, updated_at "timestamp", chat_id "chatId" ' +
        'FROM '+
          'aquest_schema.topic ' +
        'WHERE ' + 
          'topic.id = $1';
        
        paramaterized = [params];
        
        callback = result => result.rows[0];
        
        break;
      
      case 'readTopicContent':
        // atomTopicId, content, ordered, deleted, topicId, atomId
        
        /*sql =
        'SELECT ' + 
          'aquest_schema.concat_json_object(' +
            'to_json(topic), json_build_object(' +
              `'content',array_to_json(` + 
                'array_agg(' +
                  '(SELECT atom_topic.content ORDER BY atom_topic.position)' +
                ')' +
              ')' +
            ')' +
          ') as "topicWithContent" ' +
        'FROM ' +
          '(SELECT ' + 
            'topic.id, topic.title, topic.universe_id "universeId", topic.user_id author, topic.description, topic.picture, topic.updated_at "timestamp", topic.chat_id "chatId" ' +
          'FROM ' +
            `aquest_schema.topic WHERE topic.id = '${params}'`+
          ') topic, ' +
          'aquest_schema.atom_topic ' +
        'WHERE ' +
          'atom_topic.topic_id = topic.id ' +
        'GROUP BY topic';*/
        sql = 
        'SELECT ' +
          'array_to_json(' +
            'array_agg(' +
              'aquest_schema.concat_json_object(' +
                'atom_topics.content, json_build_object(' +
                  `'type',atom_topics.type`+
                ')' +
              ')' +
            ')' +
          ') AS content ' +
        'FROM ' +
          '(SELECT ' +
        		'atom_topic.content, atom_topic.type ' +
        	'FROM ' +
        		'aquest_schema.atom_topic ' +
        	'WHERE ' +
        		'atom_topic.topic_id = $1 ' + 	
        	'ORDER BY ' + 
        		'atom_topic.position' +
        	') atom_topics';
        
        paramaterized = [params];
        
        callback = result => result.rows[0].content;
        
        break;
        
      case 'createMessage':
        // atomTopicId, content, ordered, deleted, topicId, atomId
        
        sql = 
        'with addMessage as ( ' +
          'INSERT INTO aquest_schema.message ' +
            '(user_id, chat_id, created_at) ' +
          'VALUES ' +
            '($1,$2, CURRENT_TIMESTAMP) ' +
          'RETURNING message.id' +
        ')' +
        'INSERT INTO aquest_schema.atom_message (message_id, content) ' +
        `SELECT id, '{"text": "$3"}' FROM addMessage ` +
        'RETURNING id';
        
        paramaterized = [userId, chatId, messageContent];
        
        break;
        
        
      case 'createUniverse':
        // id, universe1Id, universe2Id, force, createdAt, updatedAt, deleted
        
        sql = 
        'INSERT INTO aquest_schema.universe ' +
          '(id, name, user_id, description) ' +
        'VALUES ' +
          // `('${name}', '${name}', 'johnDoe', '${description}')`;
        '($1, $2, $3, $4)';
        
        paramaterized = [name, name, userId, description];
        
        break;
        
      case 'createTopic':
        //topic : id, user_id, chat_id, universe_id, title, handle, created_at, updated_at, deleted
        //atom_topic : id; atom_id, topic_id, content, order, created_at, updated_at, deleted
        //atom : id, type, structure, created_at, updated_at, deleted
        
        /*sql = 
        'INSERT INTO aquest_schema.topic ' +
          '(id, user_id, universe_id, title, description) ' +
        'VALUES ' +
          '($1, $2, $3, $4, $5)';*/
        
        sql = 
        'SELECT ' + 
          'aquest_schema.create_atoms_topic(' + 
            '$1 ::TEXT, $2 ::TEXT, $3 ::TEXT, $4 ::TEXT, $5 ::TEXT, $6 ::TEXT' +
          ') AS create_topic';
        
        paramaterized = [id, userId, universeId, title, description, content];
        
        callback = result => result.rows[0].create_topic;
        /* +
        'SELECT create_atoms_topic(\'' + content + '\', $1)';
        paramaterized = [id, userId, universeId, title, description];*/
        
        break;
        
      case 'createUser':
        
        sql = 
        'INSERT INTO aquest_schema.user ' +
          '(id, email, password_salt, password_hash, creation_ip) ' +
        'VALUES ' +
          '($1, $2, $3, $4, $5)' +
        'RETURNING id';
        
        paramaterized = [pseudo, email, passwordHash, passwordSalt, ip];
        
        callback = result => result.rows[0];
        
        break;
        
      case 'randomRow':
        
        // INJECTION SQL !!!! à FAIRE !
        sql = `SELECT * FROM aquest_schema.${params} ORDER BY RANDOM() LIMIT 1`;
        
        callback = result => result.rows[0];
        break;
    }
    
    return {sql, callback, paramaterized};
  }
}
