import log from '../../../shared/utils/logTailor.js';
import {queryDb} from '../../queryDb.js';

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/api/universe/{handle}',
    handle: function (request, reply) {
      log('info','request params : ' + request.params.handle);
      
      let query = {
        source: 'fetchUniverseByHandle',
        parameters: request.params.handle
      };
      
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'POST',
    path: '/api/universe/{name}&{handle}&{description}',
    handle: function (request, reply) {
      log('info','request params insert universe');
      log(request.params);
      let query = {
        source: 'addUniverse',
        parameters: {name: request.params.name, handle: request.params.handle, description: request.params.description}
      };
      
      log(query);
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'GET',
    path: '/api/universes/',
    handle: function (request, reply) {
      log('info','request params all universes');
      
      let query = {
        source: 'fetchUniverses',
        parameters: ''
      };
      
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'GET',
    path: '/api/chat/{id}',
    handle: function (request, reply) {
      log('info','request params all universes');
      
      let query = {
        source: 'fetchChat',
        parameters: request.params.id
      };
      
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'POST',
    path: '/api/message/{userId}&{chatId}&{messageContent}',
    handle: function (request, reply) {
      log('info','request params insert chat message');
      log(request.params);
      let query = {
        source: 'addChatMessage',
        parameters: {userId: request.params.userId, chatId: request.params.chatId, messageContent: request.params.messageContent}
      };
      
      log(query);
      return reply(promiseRestFetch(query));
    }
  });
  
  function promiseRestFetch(query){
    return new Promise(function(resolve, reject) {
      console.log('promiseRestFetch query : ' + JSON.stringify(query));
      queryDb(query).then(function(result) {
        
        if(result != null){
          
          log('info ', JSON.stringify(result));
          
          resolve(result);  
        } else {
          reject('!!! Query promise rejected');
        }
      })
      .catch(function (reason) {
          log('RestAPI ', reason);
      });
    });
  }
  
  next();
}

exports.register.attributes = {
  'name': 'restAPI',
  'description': 'restAPI for client queries',
  'main': 'index.js'
};