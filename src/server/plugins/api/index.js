import log, {logRequest} from '../../../shared/utils/logTailor.js';
import queryDb from '../../queryDb.js';
import bcrypt from 'bcrypt';
import * as actionCreators from '../../../shared/experiment';

function apiPlugin(server, options, next) {
  
  console.log(actionCreators);
  console.log('///');
  console.log(Object.keys(actionCreators)
    .map(key => actionCreators[key].getTypes())
    .reduce((a, b) => a.concat(b)));
  console.log('///');
  
  // for (let key in actionCreators) {
  //   const {intention, method, path} = actionCreators[key].getModel();
  //   server.route({
  //     method,
  //     path: '/api/universes/',
  //     handler: (request, reply) => reply.callQueryDb(request, reply, intention)
  //   });
  // }
  
  server.route({
    method: 'GET',
    path: '/api/universes/',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'getUniverses')
  });
  
  server.route({
    method: 'GET',
    path: '/api/universe/{id}',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'getUniverse', request.params.id)
  });
  
  server.route({
    method: 'GET',
    path: '/api/inventory/{universeId}',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'getInventory', request.params.universeId)
  });
  
  server.route({
    method: 'GET',
    path: '/api/topic/content/{topicId}',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'getTopicContent', request.params.topicId)
  });
  
  server.route({
    method: 'GET',
    path: '/api/chat/{id}',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'getChat', request.params.id)
  });
  
  server.route({
    method: 'POST',
    path: '/api/universe/',
    handler: (request, reply) => {
        const {payload} = request;
        // TODO check request.payload before send to DB !
        reply.callQueryDb(request, reply, 'postUniverse', payload);
      }
  });
  
  server.route({
    method: 'POST',
    path: '/api/topic/',
    handler: (request, reply) => {
        //payload {user_id}&{universe_id}&{title}
        const {payload} = request;
        // TODO check request.payload before send to DB !
        reply.callQueryDb(request, reply, 'postTopic', payload);
      }
  });
  
  server.route({
    method: 'POST',
    path: '/api/chatMessage/',
    handler: (request, reply) => {
      //payload {userId}&{chatId}&{messageContent}
        const {payload} = request;
        // TODO check request.payload before send to DB !
        reply.callQueryDb(request, reply, 'postMessage', payload);
      }
  });
  
  server.route({
    method: 'POST',
    path: '/api/user/',
    handler: (request, reply) => {
        const {payload, info} = request;
        
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw(err);
          bcrypt.hash('B4c0/\/', salt, (err, hash) => {
            if (err) throw(err);
            payload.passwordHash = hash;
            payload.passwordSalt = salt;
            payload.ip = info.remoteAddress;
            reply.callQueryDb(request, reply, 'postUser', payload);
          });
        });
      }
  });
  
  /*function promiseRestget(query){
    return new Promise((resolve, reject) => {
      queryDb(query).then(
        result => resolve(result),
        error => reject(error)
      );
    });
  }*/
  
  server.decorate('reply', 'callQueryDb', (request, reply, intention, params) => {
      
    const response = reply.response().hold();
    
    logRequest(request);
    
    queryDb(intention, params).then(
      result => {
        response.source = result;
        response.send();
      },
      error => {
        response.statusCode  = 500;
        response.send();
      }
    );
  });
  
  next();
}

apiPlugin.attributes = {
  name:         'restAPI',
  description:  'restAPI for client queries',
  main:         'index.js'
};

export default apiPlugin;
