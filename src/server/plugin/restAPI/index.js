import WinstonLogger from '/home/dherault_gmail_com/aquest-alpha/src/server/logger/Winstonlogger.js';
import DbCaller from '/home/dherault_gmail_com/aquest-alpha/src/server/DbCaller/Dbcaller.js';

let logger = new WinstonLogger();

let restAPI = {
    register: function (server, options, next) {
        
        server.route({
          method: 'GET',
          path: '/universe/{universeId}',
          handler: function (request, reply) {
            logger.info('request params : ' + request.params.universeId);
            DbCaller.connect();
            DbCaller.query('SELECT universeId, name, description, chatId FROM aquest_schema.universe WHERE universeId=\'' + request.params.universeId + '\'');
          }
        });
        
        server.route({
          method: 'POST',
          path: '/universe/{universeId}',
          handler: function (request, reply) {
            logger.info('request params : ' + request.params.universeId);
          }
        });
        
        next();
    }
}

restAPI.register.attributes = {
    name: 'restAPI',
    version: '0.0.1'
};