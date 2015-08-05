import Joi from 'joi';

const userId    = Joi.string().trim().required().min(1).max(15).regex(/^[0-9a-zA-Z]{1,15}$/);
const chatId    = Joi.number().positive().integer().required().min(1);
const email     = Joi.string().email();
const password  = Joi.string().trim().required().min(6);

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
const API_VALIDATION_SCHEMA = {
  createUser: {
    payload: {
      pseudo:       userId,
      email,
      password
    }
  },
  createUniverse: {
    payload: {
      name:         Joi.string().trim().required().min(1).regex(/^[0-9a-zA-Z]{1,15}$/),
      description:  Joi.string().max(200),
      related:      Joi.string(),
      userId
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
      userId,
      picture:      Joi.string().allow('')
    }
  },
  login: {
    payload: {
      email:        Joi.alternatives().try(userId, email),
      password
    }
  }
};

const WEBSOCKET_VALIDATION_SCHEMA = {
  joinChat: {
    chatId,
    userId
  },
  leaveChat: {
    chatId,
    userId
  },
  createMessage: {
    id:           Joi.number().positive().integer().required().min(1),
    chatId,
    content:      Joi.object({
                    type: Joi.string().trim().required().min(1).regex(/^[0-9a-zA-Z]{1,}$/)
                  }).unknown(true).required(), 
    userId
  }
};  

export { API_VALIDATION_SCHEMA, WEBSOCKET_VALIDATION_SCHEMA };