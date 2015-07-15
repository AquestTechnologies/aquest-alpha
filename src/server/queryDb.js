import pg        from 'pg';
import query     from 'pg-query';
import devConfig from '../../config/development.js';
import log       from '../shared/utils/logTailor.js';

let client;

export default function queryDb(queryInfo) {
  
  log(`+++ --> ${queryInfo.source} ${queryInfo.params}.`);
  const d = new Date();
  
  
  return new Promise((resolve, reject) => {
    connect() 
    .then(() => {
      const {sql, callback} = buildQuery(queryInfo);
      
      if (sql) performQuery(sql)
        .then(result => resolve(typeof callback === 'function' ? callback(result) : result))
        .catch(error => reject(error));
      else reject('queryDb.buildQuery did not produce any SQL, check your query.source');
    })
    .catch(why => reject(why));
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
        }
        log(result.rowCount ? `+++ <-- ${result.rowCount} rows after ${new Date() - d}ms.` : `+++ <-- nothing after ${new Date() - d}ms.`);
        resolve(result);
      });
    });
  }
  
  
  // Builds the SQL query and optionnal callback from params
  function buildQuery(queryInfo) {
    
    let sql, callback;
    const {source, params} = queryInfo;
    
    switch (source) {
      
      case 'fetchUniverses':
        
        // sql = 'SELECT id, name, description, picture, chat_id FROM aquest_schema.universe';
        sql = 
        'SELECT ' + 
          'array_to_json(' +
            'array_agg(' +
              'json_build_object('+
                '\'id\',id,' +
                '\'name\',name,' +
                '\'description\',description,' +
                '\'picture\',picture,' +
                '\'chatId\', chat_id' +
              ')' +
            ')' +
          ') as universes ' +
        'FROM aquest_schema.universe';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = result => { // Il serait utile de se debarasser de ce callback 
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
        };
        break;
        
      case 'fetchUniverseById':
        
        sql = 
        'SELECT ' +
          'json_build_object(' + 
            '\'id\',id,' +
            '\'name\',name,' +
            '\'description\',description,' +
            '\'picture\',picture,' +
            '\'chatId\', chat_id' +
          ') as universe ' +
        'FROM ' +
          'aquest_schema.universe ' +
        'WHERE ' +
          'id = \'' + params + '\';';
        
        break;
        
      case 'fetchUniverseWithTopics':

        sql =
        'SELECT ' + 
          'json_build_object(' + 
            '\'universe\',universe, ' + 
            '\'topics\',array_agg( ' +
              'json_build_object(' +
                '\'id\',topics.id,' +
                '\'title\',topics.title,' +
  	            '\'universeId\',topics.universe_id,' +
  	            '\'author\',topics.user_id,' +
  	            '\'timestamp\',topics.updated_at,' +
  	            '\'chatId\',topics.chat_id,' +
              ')' + 
            ')' +
          ')' +   
        'FROM (' +
          'SELECT ' +    
            'universe, topic.* ' +
          'FROM' +   
            '(SELECT universe.id, universe.name, universe.description, universe.picture, universe.chat_id FROM aquest_schema.universe WHERE universe.id = \'' + params + '\') universe ' +  
            'LEFT JOIN aquest_schema.topic ON universe.id = topic.universe_id ' +
        ') topics GROUP BY universe';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = result => {
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
        };
        break;
        
      case 'fetchChatById':
        
        /*sql = 
        'SELECT \
          message.id, aquest_user.pseudo, atome_message.content, chat.name as chat_name \
        FROM \
          aquest_schema.message \
            RIGHT OUTER JOIN aquest_schema.chat ON chat.id = message.chat_id \
            LEFT JOIN aquest_schema.user aquest_user ON message.user_id = aquest_user.pseudo \
            LEFT JOIN  aquest_schema.atome_message ON message.id = atome_message.message_id \
        WHERE chat.id = \'' + params + '\'';*/
        
        sql =
        'SELECT ' +
          'json_build_object(' + 
            '\'id\', chat.id,' + 
            '\'name\', chat.name,' + 
            '\'messages\', array_agg(' + 
              'json_build_object(' + 
                '\'id\',message.id,' + 
                '\'author\',aquest_user.pseudo,' + 
                '\'content\',atome_message.content' + 
              ')' + 
            ')' + 
          ') as chat ' +
        'FROM ' +
          'aquest_schema.chat ' +
            'LEFT JOIN aquest_schema.message ON chat.id = message.chat_id ' +
            'RIGHT JOIN aquest_schema.user aquest_user ON message.user_id = aquest_user.pseudo ' +
            'RIGHT JOIN  aquest_schema.atome_message ON message.id = atome_message.message_id ' +
        'WHERE chat.id = \'' + params + '\' GROUP BY chat.id';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = result => {
          let messages = [];
          let chatName;
          
          for(let row in result.rows){
            let r=result.rows[row];
            chatName = r.chat_name;
            
            messages.push({
              id:      r.message_id,
              author:  r.pseudo,
              content: r.content.text
            });
          }
          
          return ({
            id: queryInfo.params,
            name: chatName,
            messages: messages
          });
        };
        break;
        
      case 'fetchInventory':
          
        sql = 
        'SELECT ' +  
          'array_to_json(' +  
            'array_agg(' +  
              'json_build_object(' +  
                '\'id\',topic.id,' +
                '\'title\',topic.title,' +
                '\'universeId\',topic.universe_id,' +
                '\'author\',topic.user_id,' +
                '\'description\',topic.description,' +
                '\'picture\',topic.picture,' +
                '\'timestamp\',topic.updated_at,' + 
                '\'chatId\',topic.chat_id' + 
              ')' + 
            ')' + 
          ') as topics ' +
        'FROM ' +   
          'aquest_schema.topic ' +
        'WHERE id = \'' + params + '\'';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = result => {
          let inventory = {
            universeId: params,
            topics:[]
          };
        
          for(let row in result.rows){
            let r=result.rows[row];
            inventory.topics.push({
              id:   r.id,
              title:     r.title,
              author: 	 r.pseudo,
              handle:    r.handle,
              desc:      '',
              imgPath:   '',
              timestamp: r.created_at,
              userId:    r.user_id,
              chatId:    r.chat_id
            });
          }
          
          return inventory;
        };
        break;  
        
      /*case 'fetchTopicByHandle':
        
        // id, title, author, desc, imgPath, timestamp, handle, content, chatId
        sql = 
        'SELECT \
          topic.id, topic.title, aquest_user.pseudo, topic.handle, atome_topic.content, topic.chat_id \
        FROM \
          aquest_schema.topic, aquest_schema.atome_topic, aquest_schema.user as aquest_user \
        WHERE handle=\'' + params + '\' AND topic.id = atome_topic.topic_id AND topic.user_id = aquest_user.id';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = function(result){
          let r=result.rows[0];
          return ({
            id:          r.id, 
            title:       r.title,
            pseudo:      r.pseudo,
            handle:      r.handle,
            content:     r.content,
            chatId:      r.chat_id,
          });
        };
        break;*/
      
      case 'fetchTopic':
        
        sql =
        'SELECT ' +
          'json_build_object(' + 
            '\'id\',topic.id,' +
            '\'title\',topic.title,' +
            '\'universeId\',topic.universe_id,' +
            '\'author\',topic.user_id,' +
            '\'description\',topic.description,' +
            '\'picture\',topic.picture,' +
            '\'timestamp\',topic.updated_at,' + 
            '\'chatId\',topic.chat_id' + 
          ')' +
        'FROM '+
          'aquest_schema.topic ' +
        'WHERE id = \'' + params + '\'';
        
        break;
      
      case 'fetchTopicContent':
        // atomeTopicId, content, ordered, deleted, topicId, atomeId
        
        sql =
        'SELECT \
          id, content \
        FROM \
          aquest_schema.atome_topic \
        WHERE topic_id = \'' + params + '\' order by atome_topic.order;';
        
        // TO FINISH !!!
        /*sql = 
        'SELECT  
          json_build_object(  
            'id',topic.id,
            'title',topic.title,
            'universeId',topic.universe_id,
            'author',topic.user_id,
            'description',topic.description,
            'picture',topic.picture,
            'timestamp',topic.updated_at,
            'content',topic_content, 
            'chatId',topic.chat_id 
           ) topic
        FROM  
          (SELECT 
            topic, array_to_json(array_agg((SELECT atome_topic.content ORDER BY atome_topic.position))) as topic_content
          FROM
            (SELECT * FROM aquest_schema.topic WHERE topic.id = 'newStartup') topic,
            aquest_schema.atome_topic 
          WHERE
            atome_topic.topic_id = topic.id
          GROUP BY topic
          ) topic;'*/
        
        callback = result => {
          let topicContents = [];
          
          for(let row in result.rows){
            const {id, content} = result.rows[row];
            topicContents.push({id, content});
          }
          
          return topicContents;
        };
        break;
        
      case 'addChatMessage':
        // atomeTopicId, content, ordered, deleted, topicId, atomeId
        const {userId, chatId, messageContent} = params;
        
        sql = 
        'with addMessage as ( \
          INSERT INTO aquest_schema.message \
            (user_id, chat_id, created_at, deleted) \
          VALUES \
            (\''+ userId +'\',\''+ chatId + '\', CURRENT_TIMESTAMP, \'' +  false +'\') \
          RETURNING message.id\
        ) \
        INSERT INTO aquest_schema.atome_message (message_id, content) \
        SELECT id, \'{"text": "'+ messageContent +'"}\' FROM addMessage \
        RETURNING id';
        
        break;
        
        
      case 'addUniverse':
        // id, universe1Id, universe2Id, force, createdAt, updatedAt, deleted
        const {name, handle, description} = params;
        
        sql = 
        'INSERT INTO aquest_schema.universe \
          (name, handle, description, chat_id) \
        VALUES \
          (\''+ name + '\', \'' + handle + '\', \'' + description + '\', 0)';
        
        break;
        
      case 'addTopic':
        //topic : id, user_id, chat_id, universe_id, title, handle, created_at, updated_at, deleted
        //atome_topic : id; atome_id, topic_id, content, order, created_at, updated_at, deleted
        //atome : id, type, structure, created_at, updated_at, deleted
        
        const {userId, universeId, title, handle} = params;
        sql = 
        'INSERT INTO aquest_schema.topic \
          (user_id, universe_id, title, handle, chat_id) \
        VALUES \
          (\''+ userId + '\', \''+ universeId +'\', \''+ title + '\', \'' + handle + '\', 0)';
        
        break;
        
      case 'randomRow':
        // sql = `SELECT * FROM aquest_schema.${params} OFFSET random() * (select count(*) FROM aquest_schema.${params}) LIMIT 1`;
        sql = `SELECT * FROM aquest_schema.${params} ORDER BY RANDOM() LIMIT 1`;
        break;
    }
    
    return {sql, callback};
  }
}
