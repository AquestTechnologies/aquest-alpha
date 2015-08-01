import log, {logRequest} from '../../shared/utils/logTailor.js';
import queryDb from '../queryDb.js';
import bcrypt from 'bcrypt';
import actionCreators from '../../shared/actionCreators';
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
              userId: result.id, 
              expiration: new Date().getTime() + ttl
            }, key); // synchronous
            log('... signed JWT after login', result.token.slice(0, 20));
            resolve();
          }
          else reject('password mismatch');
        });
        else reject('user not found');
      });
    },
    
    createUser: (params, result) => {
      return new Promise((resolve, reject) => {
        result.token = JWT.sign({
          valid: true, 
          userId: result.id, 
          expiration: new Date().getTime() + ttl
        }, key); // synchronous
        log('... signed JWT after user creation' + result.token);
        resolve();
      });
    },
  };
  
  // Dynamic construction of the API routes from actionCreator with API calls
  for (let key in actionCreators) {
    
    const getShape = actionCreators[key].getShape || undefined;
    const {intention, method, pathx, auth} = getShape ? getShape() : {};
    
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
          before(request, params).then(
            () => {
              logRequest(request);
              if (request.method === 'post') log(`+++ params : ${JSON.stringify(params)}`);
              
              queryDb(intention, params).then(
                result => after(params, result).then(
                  () => {
                    response.source = result;
                    response.send();
                  },
                  
                  
                  error => { // after failed
                    response.statusCode  = 500;
                    response.send();
                    log(error);
                  }
                ),
                error => { // query failed
                  response.statusCode  = 500;
                  response.send();
                  log(error);
                }
              );
            },
            error => { // before failed
              response.statusCode  = 500;
              response.send();
              log(error);
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
  description:  'REST API',
  main:         'api.js'
};

export default apiPlugin;
