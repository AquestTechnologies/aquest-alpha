import Boom from 'boom';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import queryDb from '../queryDb.js';
import log from '../../shared/utils/logTailor.js';
import devConfig from '../../../config/dev_server';
import actionCreators from '../../shared/actionCreators';
import { validateAtoms } from '../../shared/components/atoms';
import {API_VALIDATION_SCHEMA as validationSchema} from '../validationSchema.js';

function apiPlugin(server, options, next) {
  const { key, ttl } = devConfig.jwt;
  
  // Allows validation and params mutation before querying db
  const beforeQuery = {
    
    createUser: (request, response, params) => new Promise((resolve, reject) =>
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return reject(500, 'createUser bcrypt.genSalt', err);
        
        bcrypt.hash(params.password, salt, (err, hash) => {
          if (err) return reject(500, 'createUser bcrypt.hash', err);
          
          params.passwordHash = hash;
          params.ip = request.info.remoteAddress;
          params.picture = '';
          delete params.password;
          resolve();
        });
      })
    ),
    
    createUniverse: (request, response, params) => new Promise((resolve, reject) =>
      JWT.decode(request.state.jwt, key, (err, decoded) => {
        if (err) return reject(500, 'createUniverse JWT.decode', err);
        
        params.name = params.name.trim(),
        params.userId = decoded.userId; // The real user id
        params.ip = request.info.remoteAddress;
        resolve();
      })
    ),
    
    createTopic: (request, response, params) => new Promise((resolve, reject) => 
      JWT.decode(request.state.jwt, key, (err, decoded) => {
        if (err) return reject(500, 'createTopic JWT.decode', err);
        
        params.title = params.title.trim(),
        params.userId = decoded.userId; // The real user id
        params.previewType = 'text',
        params.previewContent = {
          text: 'This needs to be generated dynamically.',
        };
        
        const validationErrors = validateAtoms(params.atoms);
        validationErrors.every(error => !error) ? resolve() : reject(400, validationErrors);
      })
    ),
  };
  
  // ...
  const afterQuery = {
    
    login: (request, response, {email, password}, result) => new Promise((resolve, reject) => {
      if (result) bcrypt.compare(password, result.passwordHash, (err, isValid) => {
        if (err) return reject(500, 'login bcrypt.compare', err);
        
        if (isValid) {
          delete result.passwordHash; // We know how to keep secrets
          
          const token = {
            userId: result.id,
            expiration: new Date().getTime() + ttl,
          };
          response.state('jwt', JWT.sign(token, key), {ttl, path: '/'}); // Note: somehow, path: '/' is important
          resolve(true); // Skips token renewal
        }
        else reject(401, 'invalid password');
      });
      else reject(401, 'user not found');
    }),
    
    createUser: (request, response, params, result) => new Promise((resolve, reject) => {
      if (!result || !result.id) return reject(500, 'createUser no userId');
      
      const token = {
        userId: result.id,
        expiration: new Date().getTime() + ttl,
      };
      response.state('jwt', JWT.sign(token, key), {ttl, path: '/'});
      resolve(true);
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
              const { details } = error.data;
              log('... Joi failed:', details);
              reply(Boom.badRequest(JSON.stringify(details)));
            }
          }
        },
        handler: (request, reply) => {
          const { jwt } = request.state;
          const response = reply.response().hold();
          const params = method === 'post' ? request.payload : request.params.p;
          
          before(request, response, params).then(
            () => queryDb(intention, params).then(
              result => after(request, response, params, result).then(
                skipRenewToken => {
                  response.source = result;
                  
                  // Adds a renewed JWT in the response cookie
                  if (!skipRenewToken && jwt) JWT.verify(jwt, key, (err, {userId, expiration}) => {
                    const t = new Date().getTime();
                    
                    if (err) return handleError(response, 'handler', 500, 'JWT.verify', err);
                    else if (expiration > t) {
                      response.state('jwt', JWT.sign({userId, expiration: t + ttl}, key), {ttl, path: '/'});
                      log('... Token renewed');
                    }
                    response.send();
                  });
                  else response.send();
                },
                
                handleError.bind(null, response, 'afterQuery')
              ),
              handleError.bind(null, response, 'queryDb')
            ),
            handleError.bind(null, response, 'beforeQuery')
          );
        },
      });
    }
  }

  next();
  
  // Boom!
  function handleError(response, origin, code, msg, err) {
    
    log('!!! Error while API', origin, msg);
    log('Replying', code);
    if (err) log(err, err.stack);
    
    switch (code) {
      case 400:
        response.source = Boom.badRequest(msg);
        break;
        
      case 401:
        response.source = Boom.unauthorized(msg);
        break;
        
      default: // 500, game over
        response.source = Boom.badImplementation(msg, err);
    }
    
    response.send();
  }
}

apiPlugin.attributes = {
  name:         'apiPlugin',
  description:  'REST API',
  main:         'API.js'
};

export default apiPlugin;
