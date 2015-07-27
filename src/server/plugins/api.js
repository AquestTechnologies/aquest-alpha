import log, {logRequest} from '../../shared/utils/logTailor.js';
import queryDb from '../queryDb.js';
import bcrypt from 'bcrypt';
import * as actionCreators from '../../shared/actionCreators';
import JWT from 'jsonwebtoken';
import devConfig from '../../../config/development.js';
import Joi from 'joi';

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
    }
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
            log('... signed JWT ' + result.token);
            resolve();
          }
          else reject('password mismatch');
        });
        else reject('user not found');
      });
    },
    
    createUser: ({}, result) => {
      return new Promise((resolve, reject) => {
        if (result) {
          log('... result', result);
          result.token = JWT.sign({
            valid: true, 
            id: result.id, 
            exp: Math.floor((new Date().getTime() + ttl) / 1000)
          }, key);
          resolve();
        }
      });
    }
  };
  
  /**
   * Hapijs Joi validation schema
   * Description : This const defines a Joi validation schema that can be use against headers, query, params, payload, and auth.
   * Like data constraints might change over development time, they arn't "final" ( especially regex(/^.*$/) )
   * 
   * Structure : 
   * {
       intention: {
          headers || query || params || payload || auth :{
             <object_key>: <Joi constraint https://github.com/hapijs/joi>
          }
       }
   * }
   * */
  const validationSchema = {
    createUser: {
      payload: {
        pseudo:           Joi.string().trim().required().min(1).max(15).regex(/^[0-9a-zA-Z]{1,15}$/),
        email:            Joi.string().email(),
        password:         Joi.string().trim().required().min(6)
      }
    },
    createUniverse: {
      payload: {
        name:         Joi.string().trim().required().min(1).regex(/^[0-9a-zA-Z]{1,15}$/),
        description:  Joi.string().max(200),
        related:      Joi.string(),
        userId:       Joi.string().trim().required().min(1).max(15).regex(/^[0-9a-zA-Z]{1,15}$/)
      }
    },
    createTopic: {
      payload: {
        id:           Joi.string().trim().required().min(1).regex(/^.*$/),
        universeId:   Joi.string().trim().required().min(1).regex(/^.*$/),
        title:        Joi.string().trim().required().min(1).regex(/^.*$/),
        description:  Joi.string().trim().required().min(1).regex(/^.*$/),
        content:      Joi.array().items(
                        Joi.object({
                          type: Joi.string().trim().required().min(1).regex(/^[0-9a-zA-Z]{1,}$/)
                        }).unknown(true).required()
                      ), 
        userId:       Joi.string().trim().required().min(1).max(15).regex(/^[0-9a-zA-Z]{1,15}$/),
        picture:      Joi.string().allow('')
      }
    },
    login: {
      payload: {
        email:    Joi.string().trim().required().min(1),
        password: Joi.string().trim().required().min(6)
      }
    }
  };
  
  // Dynamic construction of the API routes from actionCreator with API calls
  for (let key in actionCreators) {
    const {intention, method, pathx, auth} = actionCreators[key].getShape();
    
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
                    log(error);
                  }
                ),
                error => {
                  response.statusCode  = 500;
                  response.send();
                  log(error);
                }
              );
            },
            error => {
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
  description:  'REST API for client queries',
  main:         'api.js'
};

export default apiPlugin;
