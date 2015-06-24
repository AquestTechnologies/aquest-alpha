import log from '../../../shared/utils/logTailor.js';
import {queryDb} from '../../queryDb.js';

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/api/universe/{handle}',
    handler: function (request, reply) {
      log('info','request params : ' + request.params.handle);
      
      let query = {
        source: 'fetchUniverseByHandle',
        parameters: request.params.handle
      };
      
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
        parameters: ''
      };
      
      return reply(promiseRestFetch(query));
    }
  });
  
  server.route({
    method: 'POST',
    path: '/api/chat/{id}&{number}&{password}',
    handler: function (request, reply) {
      log('info','request params : ' + JSON.stringify(request.params));
      
      if(request.params.password && request.params.password === 'AquestTechnologiesDHEABE'){
        let query = {
          source: 'insertChatMessages',
          parameters: { 'id': request.params.id, 'number': request.params.number}
        };
        
        log('info','request params : ' + JSON.stringify(query));
        //return reply(promiseRestFetch(query));
      }
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