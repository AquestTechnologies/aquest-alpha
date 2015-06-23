import log from '../../../shared/utils/logTailor.js';
import DbCaller from '../../DbCaller.js';
 
let db = new DbCaller();
db.connect();

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/api/universe/{handle}',
    handler: function (request, reply) {
      log('info','request params : ' + request.params.handle);
      
      let sqlQuery = {
        type: 'select',
        query: 'SELECT universeId, name, description, handler, chatId FROM aquest_schema.universe WHERE handler=\'' + request.params.handle + '\'',
        //query: 'SELECT universeId, name, description, chatId FROM aquest_schema.universe WHERE universeId= $1',
        //parameters: [request.params.universeId]
      };
      
      return new Promise(function(resolve, reject) {
        // Appel de l'action
        db.queryDb(sqlQuery).then(function(result) {
          
          if(result != null){
            
            log('info', JSON.stringify(result));
            
            return reply(result);  
          } else {
            reject('!!! Query promise rejected');
          }
        })
        .catch(function (reason) {
            log('RestAPI ', reason);
        });
      });
    }
  });
  
  server.route({
    method: 'POST',
    path: '/api/universe/{universeId}',
    handler: function (request, reply) {
      log('info','request params : ' + request.params.universeId);
    }
  });
  
  next();
}

exports.register.attributes = {
  'name': 'restAPI',
  'description': 'restAPI for client queries',
  'main': 'index.js'
};