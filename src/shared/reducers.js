import log from './utils/logTailor';
import config from '../../config/dev_shared';
import { routerStateReducer } from 'redux-react-router';
import { isAPIUnauthorized, isAPISuccess, isAPIFailure } from './actionCreators';

const { sessionDuration } = config;

export default {
  
  session: (state={}, action) => {
    const { userId, exp, redirection } = state;
    const { type, payload } = action;
    log('.R. ' + type); // Please keep this line in the first reducer
    
    if (type === 'SUCCESS_LOGIN' || type === 'SUCCESS_CREATE_USER') return {
      redirection,
      userId: payload.id,
      exp: new Date().getTime() + sessionDuration,
    };
    
    // If the API answers 200 then we renew the session expiration
    if (isAPISuccess(action)) return {
      userId,
      redirection,
      exp: new Date().getTime() + sessionDuration,
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
      return Object.assign({}, state, {[payload.id]: payload});
      
    case 'SUCCESS_LOGIN':
      return Object.assign({}, state, {[payload.id]: payload});
      
    default:
      return state;
    }
  },
  
  universes: (state={}, {type, payload, params}) => {
    let newState;
    switch (type) {
      
    case 'SUCCESS_READ_UNIVERSE':
      return Object.assign({}, state, {[payload.id]: payload});
  
    case 'SUCCESS_READ_UNIVERSES':
      newState = Object.assign({}, state);
      payload.forEach(universe => {
        if (!newState[universe.id]) newState[universe.id] = universe;
      });
      return newState;
      
    case 'SUCCESS_READ_INVENTORY':
      newState = Object.assign({}, state);
      newState[params].lastInventoryUpdate = new Date().getTime();
      return newState;
    
    case 'SUCCESS_CREATE_UNIVERSE':
      return Object.assign({}, state, {[payload.id]: payload});
    
    default:
      return state;
    }
  },
  
  chats: (state={}, {type, payload}) => {
    switch (type) {
      
    case 'SUCCESS_READ_CHAT':
      return Object.assign({}, state, {[payload.id]: payload});
      
    default:
      return state;
    }
  },
  
  topics: (state={}, {type, payload, params}) => {
    let newState;
    switch (type) {
      
    case 'SUCCESS_READ_INVENTORY':
      newState = Object.assign({}, state);
      payload.forEach(topic => newState[topic.id] = topic);
      return newState;
      
    case 'SUCCESS_READ_TOPIC':
      return Object.assign({}, state, {[payload.id]: payload});
      
    case 'SUCCESS_READ_TOPIC_ATOMS':
      newState = Object.assign({}, state);
      newState[params].atoms = payload;
      return newState;
      
    case 'SUCCESS_CREATE_TOPIC':
      return Object.assign({}, state, {[payload.id]: payload});
      
    default:
      return state;
    }
  },
  
  lastError: (state=false, action) => isAPIFailure(action) ? action.payload : false,
  
  router: (state={}, action) => routerStateReducer(state, action),
  
  // Doit être exporté en dernier pour activer les side effects après la reduction des précédants
  records: (state = [], action) => [...state, Object.assign({date: new Date().getTime()}, action)]

};
