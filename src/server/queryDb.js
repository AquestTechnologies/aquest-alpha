import pg        from 'pg';
import query     from 'pg-query';
import devConfig from '../../config/development.js';
import log       from '../shared/utils/logTailor.js';

let client;

export default function queryDb(queryInfo) {
  
  try { connect(); } 
  catch (err) { log('error', '!!! queryDb connect', err); }
  
  log('+++ ' + queryInfo.source + ' --> queryDb ' + queryInfo.type + ' ' + queryInfo.params);
  
  let query = buildQuery(queryInfo);
  let sqlString = query.sql;
  let queryCallback = query.callback;
  log(query);
  // console.log('buildQuery done!');
  return new Promise(function(resolve, reject){
  // console.log('Promise...');
  // console.log(sqlString);
  //log(sqlString);
    if(sqlString){
      performQuery(sqlString).then(function(result) {
  // console.log('performQuery then');
        if(queryCallback) resolve(queryCallback(result));
        resolve(result);
        // return result;
      }).catch(function(error) {
        reject(error);
        // return result;
      });
    }
  });
  
  function connect() {
    const pgConfig    = devConfig().pg;
    const user        = pgConfig.user;
    const password    = pgConfig.password;
    const host        = pgConfig.host; 
    const port        = pgConfig.port; 
    const database    = pgConfig.database;
    const postgresurl = 'postgres://'+user+':'+password+'@'+host+':'+port+'/'+database;
    // log('log into ' + database + ' through ' + postgresurl);
    client = new pg.Client(postgresurl);
    client.connect(function(err) {
      if(err) {
        log('error', '!!! Could not connect to postgres', err);
      }
    });
  }
  
  function performQuery(sql) {
  // console.log('performQuery');
    return new Promise(function(resolve, reject) {
  // console.log('performQuery promise');
      client.query(sql, function(err, result) {
  // console.log('pclient.query callback');
        if(err) {
          log('error', '!!! Error queryDb -> query : ', err);
          reject('error running query : ' + err);
        }
        if(result.rowCount) log('+++ Database resolved ' + result.rowCount + ' rows : ' + JSON.stringify(result.rows).substring(0,34));
        resolve(result);
      });
    });
  }
  
  function buildQuery(queryInfo) {
    let sql, callback;
    let params = queryInfo.params;
    
    switch (queryInfo.source) {
      
      case 'fetchUniverses':
        
        sql = 'SELECT id, name, description, picture, handle, chat_id FROM aquest_schema.universe';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = function(result){ // Il serait utile de se debarasser de ce callback 
          let universes = [];             // La bdd devrait renvoyer des données admissibles par l'application
            
          for(let row in result.rows){
            let r = result.rows[row];
            
            universes.push({
              id:          r.id, // id ? on peut garder universeId c'est pas mal (cf ligne 33)
              chatId:      r.chat_id,
              name:        r.name,
              description: r.description,
              picture:		 r.picture, // les chemins relatifs et absolus fonctionnes, au choix prendre relatif
              handle:      r.handle // handle ? --> je l'ai appelé comme ça dans la DB, il va falloir qu'on choisise
            });
          }
          
          return universes;
        };
        break;
        
      case 'fetchUniverseByHandle':
  
        sql = 'SELECT \
                row_to_json(universe_topics) \
              FROM ( \
                SELECT \
                  universe, array_agg(row_to_json(row(topics.topic_title, topics.topic_handle))) as topics \
                FROM ( \
                  SELECT \
              	universe, topic.title topic_title, topic.handle topic_handle \
                  FROM \
                    aquest_schema.topic, \
                    (SELECT universe.id, universe.name, universe.handle, universe.description FROM aquest_schema.universe WHERE universe.handle = \'' + params +  '\') universe \
                  WHERE \
                    topic.universe_id = universe.id \
                ) topics \
                GROUP BY topics.universe \
               ) universe_topics;'
               
        /* Format des données retournées
        {
          "universe": {
              "id": 3,
              "name": "cuteCats",
              "handle": "cuteCats",
              "description": "This is a universe for cute cats :)"
          },
          "topics": [
              {
                  "f1": "David s Cute Cat",
                  "f2": "DavidCuteCat"
              },
              {
                  "f1": "David Cute Dog",
                  "f2": "DavidCuteDog"
              }
          ]
        }*/
  
        sql = 'SELECT id, name, description, picture, handle, chat_id FROM aquest_schema.universe WHERE handle=\'' + params + '\'';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = function(result){
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
        
      case 'fetchChat':
        
        // id, author, content
        /*sql = 
        'SELECT \
          message.id, aquest_user.pseudo, atome_message.content, chat.name as chat_name \
        FROM \
          aquest_schema.message, aquest_schema.atome_message, aquest_schema.user aquest_user, aquest_schema.chat \
        WHERE \
          chat.id = message.chat_id AND aquest_user.id = message.user_id AND message.chat_id = \'' + params + '\' AND message.id = atome_message.message_id';*/
          
        sql = 
        'SELECT \
          message.id, aquest_user.pseudo, atome_message.content, chat.name as chat_name \
        FROM \
          aquest_schema.message \
            RIGHT OUTER JOIN aquest_schema.chat ON chat.id = message.chat_id \
            LEFT JOIN aquest_schema.user aquest_user ON message.user_id = aquest_user.id \
            LEFT JOIN  aquest_schema.atome_message ON message.id = atome_message.message_id \
        WHERE chat.id = \'' + params + '\'';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = function(result){
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
         
        //react need : id, title, author, desc, imgPath, timestamp, handle, chatId
         
        sql = 
        'SELECT \
          topic.id, title, aquest_user.pseudo, handle, topic.created_at, aquest_user.id as user_id, chat_id \
        FROM \
          aquest_schema.topic, aquest_schema.user as aquest_user \
        WHERE \
          topic.universe_id = \''+ params +'\' AND aquest_user.id = topic.user_id';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = function(result){
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
        
      case 'fetchTopicByHandle':
        
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
        break;
      
      case 'fetchTopicContent':
        
        // atomeTopicId, content, ordered, deleted, topicId, atomeId
        sql =
        'SELECT \
          id, content \
        FROM \
          aquest_schema.atome_topic \
        WHERE topic_id = \'' + params + '\' order by atome_topic.order;';
        
        // log('+++ ' + sql.replace('\\','').substring(0,29));
        callback = function(result){
          let topicContents = [];
          
          for(let row in result.rows){
            let r = result.rows[row];
            topicContents.push({
              id:      r.id,
              content: r.content
            });
          }
          
          return topicContents;
        };
        break;
        
      case 'addChatMessage':
        // atomeTopicId, content, ordered, deleted, topicId, atomeId
        let userId = params.userId;
        let chatId = params.chatId;
        let messageContent = params.messageContent;
        
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
        
        log('will trigger query : ');
        log(sql.replace('/\\\\n/',''));
        callback = function(result){
          
          return result;
        };
        break;
        
        
      case 'addUniverse':
        // id, universe1Id, universe2Id, force, createdAt, updatedAt, deleted
        sql = 
        'INSERT INTO aquest_schema.universe \
          (name, handle, description, chat_id) \
        VALUES \
          (\''+ params.name + '\', \'' + params.handle + '\', \'' + params.description + '\', 0)';
        
        log('will trigger query : ');
        log(sql.replace('/\\\\n/',''));
        callback = function(result){
          return result;
        };
        break;
        
      case 'addTopic':
        //topic : id, user_id, chat_id, universe_id, title, handle, created_at, updated_at, deleted
        //atome_topic : id; atome_id, topic_id, content, order, created_at, updated_at, deleted
        //atome : id, type, structure, created_at, updated_at, deleted
        
        sql = 
        'INSERT INTO aquest_schema.topic \
          (user_id, universe_id, title, handle, chat_id) \
        VALUES \
          (\''+ params.userId + '\', \''+ params.universeId +'\', \''+ params.title + '\', \'' + params.handle + '\', 0)';
        
        log('will trigger query : ');
        log(sql.replace('/\\\\n/',''));
        callback = function(result){
          
          return result;
        };
        break;
    }
    return {sql, callback};
  }
}
  
  /*return new Promise(function(resolve, reject){
    if(sqlString){
      client.query(sqlString, function(err, result) {
        if(err) {
          log('error', '!!! Error queryDb -> query : ', err);
          reject('error running query : ' + err);
        }
        if(result && result !== undefined && result.rows && result.rows[0] !== undefined){
          if(queryCallback){
            resolve(queryCallback(result));
          }
          resolve(result);
        } else {
          log('queryDb promise will be rejected');
          reject('error running query : ' + err);
        }
      });
    }
  });*/
  
  
  
  /*function handleQuery(resolve, reject, err, result, callback){
    if(err) {
      log('error', '!!! Error queryDb -> query : ', err);
      reject('error running query : ' + err);
    }
    
    if(result && result !== undefined && result.rows && result.rows[0] !== undefined){
      if(callback){
        resolve(callback(result));
      }
      resolve(result);
    }
    log('queryDb promise will be rejected');
    reject('error running query : ' + err);
  }*/
    
  /*return new Promise(function(resolve,reject){
    client.query(aquery, function(err, result) {
      if(err) {
        log('error','error running query', err);
        reject('error running query : ' + err);
      }
      
      if(result.rows[0] !== undefined){
        log('info','universe : '+ JSON.stringify(result.rows[0]));
        resolve(result);
      }
      
      reject('error running query : ' + err);
    });
  });*/