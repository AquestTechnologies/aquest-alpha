import log from '../../../shared/utils/logTailor.js';
import DbCaller from '../../DbCaller.js';

let db = new DbCaller();
db.connect();

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/api/universe/{universeId}',
    handler: function (request, reply) {
      log('info','request params : ' + request.params.universeId);
      
      let sqlQuery = 'SELECT universeId, name, description, chatId FROM aquest_schema.universe WHERE universeId=\'' + request.params.universeId + '\'';
      
      return new Promise(function(resolve, reject) {
        // Appel de l'action
        db.query(sqlQuery).then(function(result) {
          
          if(result != null){
            let universeData = {
              id:          result.rows[0].universeId,
              name:        result.rows[0].name,
              description: result.rows[0].description,
              chatId:      result.rows[0].chatId,
            };
            
            log('info', JSON.stringify(universeData));
            
            return reply(universeData);  
          } else {
            reject('Query promise rejected');
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