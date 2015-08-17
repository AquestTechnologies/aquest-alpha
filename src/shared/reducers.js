import log from './utils/logTailor';
import config from '../../config/client';
import { routerStateReducer } from 'redux-react-router';
import { isAPIUnauthorized, isAPISuccess } from './actionCreators';
import { copy, deepCopy, merge, fuse } from './utils/objectUtils';

export default {
  
  session: (state={}, action) => {
    const {type, payload} = action;
    const {userId, exp, redirection} = state;
    log('.R. ' + type); // This line in first reducer
    
    if (type === 'SUCCESS_LOGIN' || type === 'SUCCESS_CREATE_USER') return {
      redirection,
      userId: payload.id,
      exp: new Date().getTime() + config.sessionDuration,
    };
    
    // If the API answers 200 then we renew the session expiration
    if (isAPISuccess(action)) return {
      userId,
      redirection,
      exp: new Date().getTime() + config.sessionDuration,
    };
    
    // If the API answers 401 or user logs out then we kill the session
    if (isAPIUnauthorized(action) || type === 'LOGOUT') return {};
    
    if (type === 'SET_REDIRECTION') return {
      exp,
      userId,
      redirection: payload,
    };
    
    return state;
  },
  
  users: (state={}, {type, payload}) => {
    switch (type) {
      
    case 'SUCCESS_CREATE_USER':
      return fuse(state, {[payload.id]: payload});
      
    case 'SUCCESS_LOGIN':
      return fuse(state, {[payload.id]: payload});
      
    default:
      return state;
    }
  },
  
  universes: (state={}, {type, payload, params}) => {
    let newState;
    switch (type) {
      
    case 'SUCCESS_READ_UNIVERSE':
      return fuse(state, {[payload.id]: payload});
  
    case 'SUCCESS_READ_UNIVERSES':
      newState = copy(state);
      payload.forEach(universe => {
        if (!newState[universe.id]) newState[universe.id] = universe;
      });
      return newState;
      
    case 'SUCCESS_READ_INVENTORY':
      newState = deepCopy(state);
      newState[params].lastInventoryUpdate = new Date().getTime();
      return newState;
    
    case 'SUCCESS_CREATE_UNIVERSE':
      return fuse(state, {[payload.id]: payload});
    
    default:
      return state;
    }
  },
  
  chats: (state={}, {type, payload}) => {
    switch (type) {
      
    case 'SUCCESS_READ_CHAT':
      return fuse(state, {[payload.id]: payload});
      
    default:
      return state;
    }
  },
  
  topics: (state={}, {type, payload, params}) => {
    let newState;
    switch (type) {
      
    case 'SUCCESS_READ_INVENTORY':
      newState = copy(state);
      payload.forEach(topic => newState[topic.id] = topic);
      return newState;
      
    case 'SUCCESS_READ_TOPIC':
      return fuse(state, {[payload.id]: payload});
      
    case 'SUCCESS_READ_TOPIC_ATOMS':
      newState = deepCopy(state);
      newState[params].atoms = payload;
      return newState;
      
    case 'SUCCESS_CREATE_TOPIC':
      return fuse(state, {[payload.id]: payload});
      
    default:
      return state;
    }
  },
  
  router: (state={}, action) => routerStateReducer(state, action),
  
  // Doit être exporté en dernier pour activer les side effects après la reduction des précédants
  records: (state = [], action) => [...state, merge({date: new Date().getTime()}, action)]

};
