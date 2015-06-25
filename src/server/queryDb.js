import pg from 'pg';
import log from '../shared/utils/logTailor.js';
import query from 'pg-query';

export function queryDb(queryP) {
  
  const user     = 'aquestuser';
  const password = 'aquestuser';
  const host     = '146.148.13.18'; 
  const port     = '5432'; 
  const database = 'aquestdb';
  let client     = null;
  
  try{
   connect();
  } catch(err){
    log('error', '!!! queryDb connect');
    log('error', err);
  };
  
  let buildQuery = null;
  let queryCallback = null;
  log('queryDb : ' + JSON.stringify(queryP));
  
  switch (queryP.source) {
    case 'fetchUniverses':
       buildQuery = 'SELECT universeid, name, description, picturepath, handler, chatid FROM aquest_schema.universe';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let universes = [];
    
        for(let row in result.rows){
          let r = result.rows[row];
          
          universes.push({
            id:          r.universeid,
            chatId:      r.chatid,
            name:        r.name,
            description: r.description,
            picturePath: 'http://130.211.68.244:8080/img/'+r.picturepath,
            handle:      r.handler
          });
        }
        
        return universes;
      }
      break;
      
    case 'fetchUniverseByHandle':

      buildQuery = 'SELECT universeid, name, description, picturepath, handler, chatid FROM aquest_schema.universe WHERE handler=\'' + queryP.parameters + '\'';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let r=result.rows[0];
        return ({
          id:          r.universeid,
          chatId:      r.chatid,
          name:        r.name,
          description: r.description,
          picturePath: 'http://130.211.68.244:8080/img/'+r.picturepath,
          handle:      r.handler
        });
      }
      break;
      
    case 'fetchChat':
      
      // id, author, content
      buildQuery = 
      'SELECT \
        message.id, user.username, atome_message.content \
      FROM \
        aquest_schema.message, aquest_schema.atome_message, aquest_schema.user \
      WHERE message.chatid=\'' + queryP.parameters + '\' AND message.id = atome_message.messageid';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let messagesChat = [];
        
        for(let row in result.rows){
          let r=result.rows[row] ;
          
          messagesChat.push({
            id:      r.id,
            chatId:  r.queryP.parameters,
            name:    r.username,
            content: r.content
          });
        }
        
        return messagesChat;
      }
      break;
      
    case 'fetchInventory':
       
      buildQuery = 
      'SELECT \
        topicId, title, handler, created, user.username, chatId \
      FROM \
          aquest_schema.topic, aquest_schema.user \
      WHERE \
        topicId=\'' + queryP.parameters + '\' AND user.userId = topic.userId';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let universes = [];
        
        for(let row in result.rows){
          let r=result.rows[row];
          universes.push({
            topicId:  r.topiId,
            title:    r.chatId,
            handler:  r.handler,
            created:  r.created,
            username: r.username,
            userId:   r.userId,
            chatId:   r.chatId
          });
        }
        
        return universes;
      }
      break;  
      
    case 'fetchTopicByHandle':
      
      // id, title, author, desc, imgPath, timestamp, handle, content, chatId
      buildQuery = 
      'SELECT \
        topic.id, topic.title, user.username, topic.handler, atome_topic.content, topic.chatid \
      FROM \
        aquest_schema.topic, aquest_schema.atome_topic, aquest_schema.user \
      WHERE handler=\'' + queryP.parameters + '\' AND topic.topicid = atome_topic.topicid AND topic.userid = user.userid';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let r=result.rows[0];
        return ({
          id:          r.universeid,
          chatId:      r.chatid,
          name:        r.name,
          description: r.description,
          picturePath: 'http://130.211.68.244:8080/img/'+r.picturepath,
          handle:      r.handler
        });
      }
      break;
    
    case 'fetchTopicContent':
      
      // atomeTopicId, content, ordered, deleted, topicId, atomeId
      buildQuery =
      'SELECT \
        atome_topic.content \
      FROM \
        aquest_schema.atome_topic \
      WHERE topicid=\'' + queryP.parameters + '\' orderby ordered';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let topicContents = [];
        
        for(let row in result.rows){
          let r = result.rows[row];
          topicContents.push({
            id:      r.id,
            content: r.content
          });
        }
        
        return topicContents;
      }
      break;
      
    case 'addChatMessage':
      // atomeTopicId, content, ordered, deleted, topicId, atomeId
      let chatId = queryP.parameters.chatId;
      let messageContent = queryP.parameters.messageContent;
      buildQuery = 
      'with addMessage as ( \
        INSERT INTO aquest_schema.message \
          (chatId, created, deleted) \
        VALUES \
          (\''+ chatId + '\', CURRENT_TIMESTAMP, \'' +  false +'\') \
        RETURNING messageId\
      ) \
      INSERT INTO aquest_schema.atome_message \
      SELECT messageId FROM addMessage \
      RETURNING messageId';
      
      log('will trigger query : ');
      log(buildQuery.replace('/\\\\n/',''));
      queryCallback = function(result){
        
        return result;
      }
      break;
    
    default:
      // buildQuery = 'SELECT universeId, name, description, handler, chatId FROM aquest_schema.universe WHERE handler=\'' + queryP.parameters + '\'';
      return null;
      break;
  }
  
  return new Promise(function(resolve,reject){
    if(buildQuery){
      client.query(buildQuery, function(err, result) {
        handleQuery(resolve, reject, err, result, queryCallback);
      });
    }
  });
  
  function connect(){
    let postgresurl = 'postgres://'+user+':'+password+'@'+host+':'+port+'/'+database;
    log('log into ' + database + ' through ' + postgresurl);
    
    if(!client){
      client = new pg.Client(postgresurl);
      client.connect(function(err) {
        if(err) {
          log('error', '!!! Could not connect to postgres');
          log('error', err);
        }
      });
    }
  }
  
  function handleQuery(resolve, reject, err, result, callback){
    if(err) {
      log('error', '!!! Error queryDb -> query : ' + err.stack);
      reject('error running query : ' + err);
    }
    
    if(result && result.rows && result.rows[0] !== 'undefined'){
      if(callback){
        resolve(callback(result));
      }
      resolve(result);
    }
    reject('error running query : ' + err);
  }
    
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
}