import log, {logRequest} from '../../../shared/utils/logTailor.js';
import queryDb from '../../queryDb.js';
import bcrypt from 'bcrypt';
import * as actionCreators from '../../../shared/actionCreators';

function apiPlugin(server, options, next) {
  
  // Dynamic construction of the API routes
  for (let key in actionCreators) {
    const {intention, method, path} = actionCreators[key].getShape();
    
    // Applies only to actionCreators with the correct shape
    if (method && path) server.route({
      method,
      path,
      handler: (request, reply) => {
        const params = method === 'post' ? request.payload : request.params.p;
        if (overrideReply[intention]) overrideReply[intention](request, reply, intention, params);
        else reply.dbResults(request, reply, intention, params);
      }
    });
  }
  
  // Allows to perform server-side function like validations and params manipulation
  const overrideReply = {
    
    createUser: (request, reply, intention, params) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw(err);
        bcrypt.hash(params.password, salt, (err, hash) => {
          if (err) throw(err);
          params.passwordHash = hash;
          params.passwordSalt = salt;
          params.ip = request.info.remoteAddress;
          delete params.password;
          reply.dbResults(request, reply, intention, params);
        });
      });
    }
  };
  
  // Asks db middleware for data then sends results back
  server.decorate('reply', 'dbResults', (request, reply, intention, params) => {
    logRequest(request);
    if (request.method === 'post') log(`+++ params : ${JSON.stringify(params)}`);
    
    const response = reply.response().hold();
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
