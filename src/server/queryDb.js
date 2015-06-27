import pg       from 'pg';
import query    from 'pg-query';
import dbConfig from '../../config/database.js';
import log      from '../shared/utils/logTailor.js';

export function queryDb(queryP) {
  
  const user     = dbConfig.user;
  const password = dbConfig.password;
  const host     = dbConfig.host; 
  const port     = dbConfig.port; 
  const database = dbConfig.database;
  let client     = null;
  
  try {
   connect();
  } 
  catch (err) {
    log('error', '!!! queryDb connect', err);
  }
  
  let buildQuery = null;
  let queryCallback = null;
  log('queryDb : ' + JSON.stringify(queryP));
  
  // Proposition de refactoring (j'ai rien touché hein ^^ --> sauf les log pke mtn logTailor mange plusieurs arguments)
  // on y voit plus clair sans les commentaires 
  
  // switch (queryP.source) {
  //   case 'fetchTruc':
  //     log('query', '+++ fetchTruc : ' + query.data);
  //     buildQuery = 'je fais du sql';
  //     return makeQuery(buildQuery); // ou encore mieux makeQuery('je fais du sql')
  //     // pas de callback pke la bdd renvoie des données brutes assimilables telles quelles par l'app
  //   case 'fetchMachin':
  //     // ...
  // }
  
  // function makeQuery(sqlString) {
  //   return new Promise(function(resolve, reject) {
  //     client.query(sqlString, function(err, result) {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(result); //result a deja la bonne structure pke la bdd est trop cool
  //     });
  //   });
  // }
  
  switch (queryP.source) {
    case 'fetchUniverses':
       buildQuery = 'SELECT "universeId", "name", "description", "picturePath", "handler", "chatId" FROM aquest_schema.universe';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){ // Il serait utile de se debarasser de ce callback 
        let universes = [];             // La bdd devrait renvoyer des données admissibles par l'application
          
        for(let row in result.rows){
          let r = result.rows[row];
          
          universes.push({
            id:          r.universeId, // id ? on peut garder universeId c'est pas mal (cf ligne 33)
            chatId:      r.chatId,
            name:        r.name,
            description: r.description,
            picturePath: 'http://130.211.68.244:8080/'+r.picturePath, // les chemins relatifs et absolus fonctionnes, au choix prendre relatif
            handle:      r.handler // handler ? 
          });
        }
        
        return universes;
      };
      break;
      
    case 'fetchUniverseByHandle':

      buildQuery = 'SELECT "universeId", "name", "description", "picturePath", "handler", "chatId" FROM aquest_schema.universe WHERE handler=\'' + queryP.parameters + '\'';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let r=result.rows[0];
        log(r);
        return ({
          id:          r.universeId,
          chatId:      r.chatId,
          name:        r.name,
          description: r.description,
          picturePath: 'http://130.211.68.244:8080/'+r.picturePath,
          handle:      r.handler
        });
      };
      break;
      
    case 'fetchChat':
      
      // id, author, content
      buildQuery = 
      'SELECT \
        message."messageId", aquest_user."userName", atome_message."content", chat.name as chatname \
      FROM \
        aquest_schema.message, aquest_schema.atome_message, aquest_schema.user aquest_user, aquest_schema.chat \
      WHERE aquest_user."userId"=message."userId" AND message."chatId"=\'' + queryP.parameters + '\' AND message."messageId" = atome_message."messageId"';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let messages = [];
        let chatName;
        
        for(let row in result.rows){
          let r=result.rows[row];
          chatName = r.chatname;
          
          messages.push({
            id:      r.id,
            author:    r.userName,
            content: r.content.text
          });
        }
        
        return ({
          id: queryP.parameters,
          name: chatName,
          messages: messages
        });
      };
      break;
      
    case 'fetchInventory':
       
      buildQuery = 
      'SELECT \
        "topicId", "title", "handler", "created", user."userName", "chatId" \
      FROM \
          aquest_schema.topic, aquest_schema.user \
      WHERE \
        "topicId"=\'' + queryP.parameters + '\' AND user."userId" = topic."userId"';
      
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
            username: r.userName,
            userId:   r.userId,
            chatId:   r.chatId
          });
        }
        
        return universes;
      };
      break;  
      
    case 'fetchTopicByHandle':
      
      // id, title, author, desc, imgPath, timestamp, handle, content, chatId
      buildQuery = 
      'SELECT \
        topic."topicId", topic."title", user."userName", topic."handler", atome_topic."content", topic."chatId" \
      FROM \
        aquest_schema.topic, aquest_schema.atome_topic, aquest_schema.user \
      WHERE "handler"=\'' + queryP.parameters + '\' AND topic."topicId" = atome_topic."topicId" AND topic."userId" = user."userId"';
      
      log('will trigger query : ' + buildQuery);
      queryCallback = function(result){
        let r=result.rows[0];
        return ({
          id:          r.universeId, 
          chatId:      r.chatId,
          name:        r.userName,
          description: r.description,
          picturePath: 'http://130.211.68.244:8080/'+r.picturePath,
          handle:      r.handler
        });
      };
      break;
    
    case 'fetchTopicContent':
      
      // atomeTopicId, content, ordered, deleted, topicId, atomeId
      buildQuery =
      'SELECT \
        atome_topic.content \
      FROM \
        aquest_schema.atome_topic \
      WHERE "topicId"=\'' + queryP.parameters + '\' orderby ordered';
      
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
      };
      break;
      
    case 'addChatMessage':
      // atomeTopicId, content, ordered, deleted, topicId, atomeId
      let userId = queryP.parameters.userId;
      let chatId = queryP.parameters.chatId;
      let messageContent = queryP.parameters.messageContent;
      
      buildQuery = 
      'with addMessage as ( \
        INSERT INTO aquest_schema.message \
          ("userId", "chatId", created, deleted) \
        VALUES \
          (\''+ userId +'\',\''+ chatId + '\', CURRENT_TIMESTAMP, \'' +  false +'\') \
        RETURNING "messageId"\
      ) \
      INSERT INTO aquest_schema.atome_message ("messageId", content) \
      SELECT "messageId", \'{"text": "'+ messageContent +'"}\' FROM addMessage \
      RETURNING "messageId"';
      
      log('will trigger query : ');
      log(buildQuery.replace('/\\\\n/',''));
      queryCallback = function(result){
        
        return result;
      };
      break;
    
    default:
      // buildQuery = 'SELECT universeId, name, description, handler, chatId FROM aquest_schema.universe WHERE handler=\'' + queryP.parameters + '\'';
      return null;
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
          log('error', '!!! Could not connect to postgres', err);
        }
      });
    }
  }
  
  function handleQuery(resolve, reject, err, result, callback){
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