import log, {logRequest} from '../../../shared/utils/logTailor.js';
import queryDb from '../../queryDb.js';

function apiPlugin(server, options, next) {
  
  server.route({
    method: 'GET',
    path: '/api/universes/',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'fetchUniverses')
  });
  
  server.route({
    method: 'GET',
    path: '/api/universe/{id}',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'fetchUniverse', request.params.id)
  });
  
  server.route({
    method: 'GET',
    path: '/api/inventory/{universeId}',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'fetchInventory', request.params.universeId)
  });
  
  server.route({
    method: 'GET',
    path: '/api/topic/content/{topicId}',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'fetchTopicContent', request.params.topicId)
  });
  
  server.route({
    method: 'GET',
    path: '/api/chat/{id}',
    handler: (request, reply) => reply.callQueryDb(request, reply, 'fetchChat', request.params.id)
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
        reply.callQueryDb(request, reply, 'postChatMessage', payload);
      }
  });
  
  /*function promiseRestFetch(query){
    return new Promise((resolve, reject) => {
      queryDb(query).then(
        result => resolve(result),
        error => reject(error)
      );
    });
  }*/
  
  server.decorate('reply', 'callQueryDb', (request, reply, source, params) => {
      
    const response = reply.response().hold();
    
    logRequest(request);
    
    queryDb({source, params}).then(
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
