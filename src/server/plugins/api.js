import log, {logRequest} from '../../shared/utils/logTailor.js';
import queryDb from '../queryDb.js';
import bcrypt from 'bcrypt';
import * as actionCreators from '../../shared/actionCreators';
import aguid from 'aguid';
import cache from '../lib/cache';
import JWT from 'jsonwebtoken';
import devConfig from '../../../config/development.js';

function apiPlugin(server, options, next) {
  const {key, ttl} = devConfig().jwt;
  
  // Allows validation and params mutation before querying db
  const beforeQuery = {
    
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
  
  // ...
  const afterQuery = {
    
    login: ({email, password}, result) => {
      return new Promise((resolve, reject) => {
        if (result) bcrypt.compare(password, result.password_hash, (err, isValid) => {
          if (err) return reject(err);
          if (isValid) {
            result.token = JWT.sign({
              valid: true, 
              id: result.id, 
              exp: Math.floor((new Date().getTime() + ttl) / 1000)
            }, key); // synchronous
            resolve();
          }
          else reject('password mismatch');
        });
        else reject('user not found');
      });
    },
  };
  
  // Dynamic construction of the API routes from actionCreator with API calls
  for (let key in actionCreators) {
    const {intention, method, pathx, auth} = actionCreators[key].getShape();
    
    if (method && pathx) {
      const before = beforeQuery[intention] || (() => Promise.resolve());
      const after  = afterQuery[intention]  || (() => Promise.resolve());
      
      server.route({
        method,
        path: pathx,
        config : {auth},
        handler: (request, reply) => {
          const params = method === 'post' ? request.payload : request.params.p;
          const response = reply.response().hold();
          
          before(request, params)
          .then(
            () => {
              logRequest(request);
              if (request.method === 'post') log(`+++ params : ${JSON.stringify(params)}`);
              
              queryDb(intention, params).then(
                result => after(params, result).then(
                  () => {
                    response.source = result;
                    response.send();
                  },
                  error => {
                    response.statusCode  = 500;
                    response.send();
                    log('error', error);
                  }
                ),
                error => {
                  response.statusCode  = 500;
                  response.send();
                  log('error', error);
                }
              );
            },
            error => {
              response.statusCode  = 500;
              response.send();
              log('error', error);
            }
          );
        },
      });
    }
  }

  next();
}

apiPlugin.attributes = {
  name:         'apiPlugin',
  description:  'REST API for client queries',
  main:         'api.js'
};

export default apiPlugin;
