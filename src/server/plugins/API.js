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
    
    createUser: (request, params) => new Promise((resolve, reject) => {
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
    }),
  };
  
  // ...
  const afterQuery = {
    
    login: ({email, password}, result, response) => new Promise((resolve, reject) => {
      if (result) bcrypt.compare(password, result.password_hash, (err, isValid) => {
        if (err) return reject(err);
        if (isValid) {
          const userId = result.id;
          const expiration = new Date().getTime() + ttl;
          response.state('jwt', JWT.sign({userId, expiration}, key), {ttl});
          resolve(true);
        }
        else reject('password mismatch');
      });
      else reject('user not found');
    }),
    
    createUser: (params, result, response) => new Promise((resolve, reject) => {
      const userId = result.id;
      const expiration = new Date().getTime() + ttl;
      response.state('jwt', JWT.sign({userId, expiration}, key), {ttl});
      resolve(true);
    }),
  };
  
  // Adds a renewed JWT in the response cookie
  function renewToken({state: {jwt}}, response) {
    if (jwt) JWT.verify(jwt, key, (err, {userId, expiration}) => {
      const t = new Date().getTime();
      if (err) log(err);
      else if (expiration > t) {
        response.state('jwt', JWT.sign({userId, expiration: t + ttl}, key), {ttl}).send();
        log('... Token renewed');
      }
    });
    else response.send();
  }
  
  // Dynamic construction of the API routes from actionCreator with API calls
  for (let acKey in actionCreators) {
    
    const getShape = actionCreators[acKey].getShape || undefined;
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
              if (request.method === 'post') log(`+++ params : ${JSON.stringify(params)}`);
              
              queryDb(intention, params).then(
                result => after(params, result, response).then(
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
