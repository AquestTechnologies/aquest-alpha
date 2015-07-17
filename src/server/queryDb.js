import pg        from 'pg';
import devConfig from '../../config/development.js';
import log       from '../shared/utils/logTailor.js';

let client;

export default function queryDb(queryInfo) {
  
  log(`+++ --> ${queryInfo.source} - ${queryInfo.params}`);
  const d = new Date();
  
  return new Promise((resolve, reject) => {
    connect() 
    .then(
      () => {
        const {sql, callback} = buildQuery(queryInfo);
        log(`+++ REQUETE --> ${sql}`);
        if (sql) performQuery(sql)
          .then(
            result => resolve(typeof callback === 'function' ? callback(result) : result),
            error => reject(error)
          );
        else reject('queryDb.buildQuery did not produce any SQL, check your query.source');
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
        if (err) {
          log('error', '!!! Could not connect to postgres', err);
          reject('queryDb connection failed.');
          return;
        } 
        resolve();
      });
    });
  }
  
  
  // Performs a given SQL string
  function performQuery(sql) {
    
    return new Promise((resolve, reject) => {
      client.query(sql, (err, result) => {
        if (err) {
          log('error', '!!! Error queryDb.performQuery : ', err);
          reject(`error running query : ${sql}`);
          return;
        }
        log(result.rowCount ? `+++ <-- ${result.rowCount} rows after ${new Date() - d}ms` : `+++ <-- nothing after ${new Date() - d}ms`);
        resolve(result);
      });
    });
  }
  
  
  // Builds the SQL query and optionnal callback from params
  function buildQuery(queryInfo) {
    
    const {source, params} = queryInfo;
    
    const {userId, universeId, title, chatId, messageContent, name, description, pseudo, email, passwordHash, passwordSalt, ip} = 
      typeof params === 'object' && !(params instanceof Array) ? params : {};
    
    let sql, callback;
    
    switch (source) {
      
      case 'fetchUniverses':
        // sql = 'SELECT id, name, description, picture, chat_id FROM aquest_schema.universe';
        sql = 
        'SELECT ' + 
          'id, name, description, picture, chat_id "chatId" ' +
        'FROM ' + 
          'aquest_schema.universe';
        
        callback = result => result.rows;
        
        // log('+++ ' + sql.replace('','').substring(0,29));
        /*callback = result => { // Il serait utile de se debarasser de ce callback 
          let universes = [];             // La bdd devrait renvoyer des données admissibles par l'application
            
          for(let row in result.rows){
            let r = result.rows[row];
            
            universes.push({
              id:          r.id,
              chatId:      r.chat_id,
              name:        r.name,
              description: r.description,
              picture:		 r.picture
            });
          }
          
          return universes;
        };*/
        
        break;
        
      case 'fetchUniverse':
        
        sql = 
        'SELECT ' + 
          'id, name, description, picture, chat_id "chatId" ' +
        'FROM ' +
          'aquest_schema.universe ' +
        'WHERE ' +
          `id = '${params}'`;
          
        callback = result => result.rows[0];
          
        break;
        
      case 'fetchUniverseWithTopics':
        
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
            `(SELECT universe.id, universe.name, universe.description, universe.picture, universe.chat_id "chatId" FROM aquest_schema.universe WHERE universe.id = '${params}') universe ` +  
            'LEFT JOIN aquest_schema.topic ON universe.id = topic.universe_id ' +
        ') topics GROUP BY universe';
        
        callback = result => result.rows[0].UniverseWithTopics;
        
        // log('+++ ' + sql.replace('','').substring(0,29));
        /*callback = result => {
          let r=result.rows[0];
          // log(r);
          return ({
            id:          r.id,
            chatId:      r.chat_id,
            name:        r.name,
            description: r.description,
            picture:		 r.picture,
            handle:      r.handle
          });
        };*/
        break;
        
      case 'fetchChat':
        
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
        `WHERE chat.id = '${params}' GROUP BY chat.id`;
        
        callback = result => result.rows[0].chat;
        
        // log('+++ ' + sql.replace('','').substring(0,29));
        /*callback = result => {
          let messages = [];
          let chatName;
          
          for(let row in result.rows){
            let r=result.rows[row];
            chatName = r.chat_name;
            
            messages.push({
              id:      r.message_id,
              author:  r.id,
              content: r.content.text
            });
          }
          
          return ({
            id: queryInfo.params,
            name: chatName,
            messages: messages
          });
        };*/
        break;
        
      case 'fetchInventory':
          
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
        `WHERE topic.universe_id= '${params}'`;
        
        callback = result => result.rows;
        // callback = result => result.rows.map(row => row.topics);
        
        break;  
        
      /*case 'fetchTopicByHandle':
        
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
      
      case 'fetchTopic':
        
        sql =
        'SELECT ' +
          'id, title, universe_id "universeId", user_id author, description, picture, updated_at "timestamp", chat_id "chatId" ' +
        'FROM '+
          'aquest_schema.topic ' +
        `WHERE topic.id = '${params}'`;
        
        callback = result => result.rows[0];
        
        break;
      
      case 'fetchTopicContent':
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
        		`atom_topic.topic_id = '${params}' ` + 	
        	'ORDER BY ' + 
        		'atom_topic.position' +
        	') atom_topics';
        
        /*callback = result => {
          let topicContents = [];
          
          for(let row in result.rows){
            const {id, content} = result.rows[row];
            topicContents.push({id, content});
          }
          
          return topicContents;
        };*/
        
        callback = result => result.rows[0].content;
        
        break;
        
      case 'addChatMessage':
        // atomTopicId, content, ordered, deleted, topicId, atomId
        
        sql = 
        'with addMessage as ( ' +
          'INSERT INTO aquest_schema.message ' +
            '(user_id, chat_id, created_at) ' +
          'VALUES ' +
            `('${userId}','${chatId}', CURRENT_TIMESTAMP) ` +
          'RETURNING message.id' +
        ')' +
        'INSERT INTO aquest_schema.atom_message (message_id, content) ' +
        `SELECT id, '{"text": "${messageContent}"}' FROM addMessage ` +
        'RETURNING id';
        
        break;
        
        
      case 'addUniverse':
        // id, universe1Id, universe2Id, force, createdAt, updatedAt, deleted
        
        sql = 
        'INSERT INTO aquest_schema.universe ' +
          '(id, name, user_id, description) ' +
        'VALUES ' +
          // `('${name}', '${name}', 'johnDoe', '${description}')`;
        `('${name}', '${name}', '${userId}', '${description}')`;
        
        break;
        
      case 'addTopic':
        //topic : id, user_id, chat_id, universe_id, title, handle, created_at, updated_at, deleted
        //atom_topic : id; atom_id, topic_id, content, order, created_at, updated_at, deleted
        //atom : id, type, structure, created_at, updated_at, deleted
        
        sql = 
        'INSERT INTO aquest_schema.topic ' +
          '(user_id, universe_id, title) ' +
        'VALUES ' +
          `('${userId}','${universeId}', '${title}')`;
        
        break;
        
      case 'postUser':
        
        sql = 
        'INSERT INTO aquest_schema.user ' +
          '(id, email, password_salt, password_hash, creation_ip) ' +
        'VALUES ' +
          `('${pseudo}','${email}', '${passwordHash}', '${passwordSalt}', '${ip}')` +
        'RETURNING id';
        
        callback = result => result.rows[0];
        
        break;
        
      case 'randomRow':
        
        sql = `SELECT * FROM aquest_schema.${params} ORDER BY RANDOM() LIMIT 1`;
        callback = result => result.rows[0];
        break;
    }
    
    return {sql, callback};
  }
}
