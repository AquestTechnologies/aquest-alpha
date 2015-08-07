import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import queryDb from '../queryDb.js';
import log from '../../shared/utils/logTailor.js';
import devConfig from '../../../config/development.js';
import actionCreators from '../../shared/actionCreators';
import {API_VALIDATION_SCHEMA as validationSchema} from '../validationSchema.js';

function apiPlugin(server, options, next) {
  const {key, ttl} = devConfig().jwt;
  
  // Allows validation and params mutation before querying db
  const beforeQuery = {
    
    createUser: (request, params) => new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return reject(err);
        bcrypt.hash(params.password, salt, (err, hash) => {
          if (err) return reject(err);
          params.passwordHash = hash;
          params.ip = request.info.remoteAddress;
          params.picture = '';
          delete params.password;
          resolve();
        });
      });
    }),
    
    createUniverse: (request, params) => new Promise((resolve, reject) => {
      JWT.verify(request.state.jwt, key, (err, decoded) => { // JWT.decode() should be enough since the token has already been verified by Hapi-Auth-JWT2
        if (err) return reject(err);
        params.userId = decoded.userId; // The real user id
        params.ip = request.info.remoteAddress; // We should add this in the universe schema
        resolve();
      });
    }),
  };
  
  // ...
  const afterQuery = {
    
    login: ({email, password}, result, response) => new Promise((resolve, reject) => {
      if (result) bcrypt.compare(password, result.passwordHash, (err, isValid) => {
        if (err) return reject(err);
        if (isValid) {
          delete result.passwordHash;
          const userId = result.id;
          const expiration = new Date().getTime() + ttl;
          response.state('jwt', JWT.sign({userId, expiration}, key), {ttl, path: '/'}); // Note: somehow, path: '/' is important
          resolve(true); // Skips token renewal
        }
        else reject('password mismatch'); // Alerte : reject n'est pas le comportement attendu
      });
      else reject('user not found');
    }),
    
    createUser: (params, result, response) => new Promise((resolve, reject) => {
      // Alerte!!! Il faut que la bdd reponde ok pour pouvoir creer un cookie/token !!!!
      const userId = result.id;
      const expiration = new Date().getTime() + ttl;
      response.state('jwt', JWT.sign({userId, expiration}, key), {ttl, path: '/'});
      resolve(true); // Skips token renewal
    }),
  };
  
  // Adds a renewed JWT in the response cookie
  function renewToken({state: {jwt}}, response) {
    if (jwt) JWT.verify(jwt, key, (err, {userId, expiration}) => {
      const t = new Date().getTime();
      if (err) log(err);
      else if (expiration > t) {
        response.state('jwt', JWT.sign({userId, expiration: t + ttl}, key), {ttl, path: '/'}).send();
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
      const validate = validationSchema[intention];
      
      server.route({
        method,
        path: pathx,
        config : {auth, validate},
        handler: (request, reply) => {
          const params = method === 'post' ? request.payload : request.params.p;
          const response = reply.response().hold();
          
          before(request, params).then(
            () => queryDb(intention, params).then(
              result => after(params, result, response).then(
                skipRenewToken => {
                  response.source = result;
                  skipRenewToken ? response.send() : renewToken(request, response);
                },
                
                error => {
                  log('!!! Error while afterQuery:', error.message);
                  response.statusCode  = 500;
                  response.send();
                }
              ),
              error => {
                log('!!! Error while query:', error.message);
                response.statusCode  = 500;
                response.send();
              }
            ),
            error => {
              log('!!! Error while beforeQuery:', error.message);
              response.statusCode  = 500;
              response.send();
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
  main:         'API.js'
};

export default apiPlugin;
