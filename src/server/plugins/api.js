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
            log('... signed JWT ' + result.token);
            resolve();
          }
          else reject('password mismatch');
        });
        else reject('user not found');
      });
    },
    createUser: (result) => {
      
    }
  };
  
  const validationSchema = {
    createUser: {
      payload: {
        pseudo:           Joi.string().trim().required().min(1).max(15).regex(/^[0-9a-zA-Z]{1,15}$/),
        email:            Joi.string().email(),
        password:         Joi.string().min(5).regex(/^(?=.*){6,}$/)
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
        title:    Joi.string().trim().required().min(1).regex(/^$/),
        content:  [{type: Joi.string().trim().required(),content:Joi.object().required()}],
        userId:   Joi.string().trim().required().min(1).max(15).regex(/^[0-9a-zA-Z]{1,15}$/),
        picture:  Joi.string() 
      }
    },
    login: {
      params: {
        email:   Joi.string().trim().required().regex(/^$/),
        password:  Joi.string().trim().required().min(5).regex(/^(?=.*){6,}$/)
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
