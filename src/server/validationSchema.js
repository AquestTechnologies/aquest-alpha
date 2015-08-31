import Joi from 'joi';

const userId    = Joi.string().trim().required().min(1).max(15).regex(/^[0-9a-zA-Z]{1,15}$/);
const chatId    = Joi.number().positive().integer().required().min(1);
const email     = Joi.string().email();
const password  = Joi.string().trim().required().min(6);
const voteRoomId = Joi.string().trim().required().regex(/^(topic|universe)-/);

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
    pseudo:       userId,
    email,
    password
  },
  
  createUniverse: {
    // name:         Joi.string().trim().required().min(1).regex(/^[0-9a-zA-Z]{1,15}$/), // Le regex n'est pas bon, "ô-ïçé" doit etre valide
    name:         Joi.string().trim().required().min(1).max(100),
    description:  Joi.string().trim().max(200),
    picture:      Joi.string().required(),
    // related:      Joi.array().optional(),
  },
  
  createTopic: {
    title:        Joi.string().trim().required().min(1).regex(/^.*$/),
    universeId:   Joi.string().trim().required().min(1).regex(/^.*$/),
    atoms:        Joi.array().items(
      Joi.object().keys({
        type: Joi.string().trim().required().min(1),
        content: Joi.object().required(),
      }).unknown(false).required()), 
  },
  
  login: {
    password,
    email: Joi.alternatives().try(userId, email),
  }
};

const WEBSOCKET_VALIDATION_SCHEMA = {
  joinChat: chatId,
  leaveChat: chatId,
  createMessage: {
    chatId,
    message: {
      id: Joi.string().trim().required().regex(/^lc-[0-9]+$/),      
      content:  Joi.object({
                  type: Joi.string().trim().required().min(1).regex(/^[0-9a-zA-Z]{1,}$/)
                }).unknown(true).required()
    }
  },
  joinVote: voteRoomId,
  leaveVote: voteRoomId,
  createVoteMessage: {
    id: Joi.string().trim().required().min(1),
    voteTargetContext: {
      chatId,
      chatContextId: voteRoomId,
      messageId: Joi.number().positive().integer().required().min(1), 
      messageIndex: Joi.number().positive().integer().required().min(1)
    }
  }
};  

export { API_VALIDATION_SCHEMA, WEBSOCKET_VALIDATION_SCHEMA };
