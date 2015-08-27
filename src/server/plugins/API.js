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
    
    createUser: (request, params) => new Promise((resolve, reject) =>
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
      })
    ),
    
    createUniverse: (request, params) => new Promise((resolve, reject) =>
      JWT.verify(request.state.jwt, key, (err, decoded) => { // JWT.decode() should be enough since the token has already been verified by Hapi-Auth-JWT2
        if (err) return reject(err);
        params.name = params.name.trim(),
        params.userId = decoded.userId; // The real user id
        params.ip = request.info.remoteAddress;
        resolve();
      })
    ),
    
    createTopic: (request, params) => new Promise((resolve, reject) => 
      JWT.verify(request.state.jwt, key, (err, decoded) => { // JWT.decode() should be enough since the token has already been verified by Hapi-Auth-JWT2
        if (err) return reject(err);
        params.title = params.title.trim(),
        params.userId = decoded.userId; // The real user id
        params.previewType = 'text',
        params.previewContent = {
          text: 'This needs to be generated dynamically.',
        };
        resolve();
      })
    ),
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
        config: {
          auth, 
          validate: { 
            payload: validationSchema[intention],
            failAction: (request, reply, source, error) => { 
              // servira à renvoyer des messages d'erreur custom
              const response = reply.response().hold();
              log('... Joi failed:', error.data.details); // Pas pour la prod mais c'est relou d'aller dans console/network pour voir le message en devlopement
              response.statusCode = 400;
              response.source = error.data.details;
              response.send();
            }
          }
        },
        handler: (request, reply) => {
          const params = method === 'post' ? request.payload : Object.keys(request.params).length === 1 && request.params.p ? request.params.p : request.params;
          const response = reply.response().hold();
          
          before(request, params).then(
            () => queryDb(intention, params).then(
              result => after(params, result, response).then(
                skipRenewToken => {
                  
                  // Adds a renewed JWT in the response cookie
                  const { jwt } = request.state;
                  if (!skipRenewToken && jwt) JWT.verify(jwt, key, (err, {userId, expiration}) => {
                    const t = new Date().getTime();
                    if (err) log(err);
                    else if (expiration > t) {
                      response.state('jwt', JWT.sign({userId, expiration: t + ttl}, key), {ttl, path: '/'});
                      log('... Token renewed');
                    }
                  });
                  
                  response.source = result;
                  response.send();
                },
                
                error => {
                  log('!!! Error while API afterQuery:', error.stack);
                  response.statusCode  = 500;
                  response.send();
                }
              ),
              error => {
                log('!!! Error while queryDb:', error.message, JSON.stringify(error));
                response.statusCode  = 500;
                response.send();
              }
            ),
            error => {
              log('!!! Error while API beforeQuery:', error.stack);
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
