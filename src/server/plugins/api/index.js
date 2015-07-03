import log from '../../../shared/utils/logTailor.js';
import queryDb from '../../queryDb.js';

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/api/universe/{handle}',
    handler: function (request, reply) {
      log('info','request params : ' + request.params.handle);
      
      let query = {
        source: 'fetchUniverseByHandle',
        params: request.params.handle
      };
      
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'POST',
    path: '/api/universe/{name}&{handle}&{description}',
    handler: function (request, reply) {
      log('info','request params insert universe');
      log(request.params);
      let query = {
        source: 'addUniverse',
        params: {name: request.params.name, handle: request.params.handle, description: request.params.description}
      };
      
      log(query);
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'GET',
    path: '/api/inventory/{universeId}',
    handler: function (request, reply) {
      log('info','request restAPI params : ' + request.params.universeId);
      
      let query = {
        source: 'fetchInventory',
        params: request.params.universeId
      };
      
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'POST',
    path: '/api/topic/{user_id}&{universe_id}&{title}&{handle}',
    handler: function (request, reply) {
      log('info','request params insert topic');
      log(request.params);
      let query = {
        source: 'addTopic',
        params: {userId: request.params.user_id, universeId: request.params.universe_id, title: request.params.title, handle: request.params.handle}
      };
      
      log(query);
      return reply(promiseRestFetch(query));
    }
  });
  
  
  server.route({
    method: 'GET',
    path: '/api/universes/',
    handler: function (request, reply) {
      log('info','request params all universes');
      
      let query = {
        source: 'fetchUniverses',
        params: ''
      };
      
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'GET',
    path: '/api/chat/{id}',
    handler: function (request, reply) {
      log('info','request params all universes');
      
      let query = {
        source: 'fetchChat',
        params: request.params.id
      };
      
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'POST',
    path: '/api/message/{userId}&{chatId}&{messageContent}',
    handler: function (request, reply) {
      log('info','request params insert chat message');
      log(request.params);
      let query = {
        source: 'addChatMessage',
        params: {userId: request.params.userId, chatId: request.params.chatId, messageContent: request.params.messageContent}
      };
      
      log(query);
      return reply(promiseRestFetch(query));
    }
  });
  
  function promiseRestFetch(query){
    return new Promise(function(resolve, reject) {
      //console.log('promiseRestFetch query : ' + JSON.stringify(query));
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
};

exports.register.attributes = {
  'name': 'restAPI',
  'description': 'restAPI for client queries',
  'main': 'index.js'
};