import log, {logRequest} from '../../../shared/utils/logTailor.js';
import queryDb from '../../queryDb.js';
import bcrypt from 'bcrypt';
import * as actionCreators from '../../../shared/actionCreators';

function apiPlugin(server, options, next) {
  
  // Dynamic construction of the API routes from actionCreator with API calls
  for (let key in actionCreators) {
    const {intention, method, pathx} = actionCreators[key].getShape();
    
    if (method && pathx) server.route({
      method,
      path: pathx,
      handler: (request, reply) => {
        const params = method === 'post' ? request.payload : request.params.p;
        
        if (!validators[intention]) sendResults(request, reply, intention, params);
        else validators[intention](request, params).then(
          () => sendResults(request, reply, intention, params),
          error => log('error', error)
        );
      },
    });
  }

  // Allows validation and params mutation before querying db
  const validators = {
    
    createUser: (request, params) => {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) reject(err);
          bcrypt.hash(params.password, salt, (err, hash) => {
            if (err) reject(err);
            params.passwordHash = hash;
            params.passwordSalt = salt;
            params.ip = request.info.remoteAddress;
            delete params.password;
            resolve();
          });
        });
      });
    },
  };
  
  // Asks db middleware for data then sends results back
  function sendResults(request, reply, intention, params) {
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
  }
  
  next();
}

apiPlugin.attributes = {
  name:         'apiPlugin',
  description:  'REST API for client queries',
  main:         'index.js'
};

export default apiPlugin;
