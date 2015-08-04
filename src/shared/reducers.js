import Immutable from 'immutable';
import log from './utils/logTailor';
import config from '../../config/client';
import { routerStateReducer } from 'redux-react-router';
import { isAPIUnauthorized, isAPISuccess } from './actionCreators';


// From the Immutable.js Github wiki
const fromJSGreedy = js => typeof js !== 'object' || js === null ? js : Array.isArray(js) ? 
  Immutable.Seq(js).map(fromJSGreedy).toList() :
  Immutable.Seq(js).map(fromJSGreedy).toMap();
const _map = Immutable.Map();

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
  
  users: (state=_map, action) => {
    switch (action.type) {
      
    case 'SUCCESS_CREATE_USER':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
      
    case 'SUCCESS_LOGIN':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
      
    default:
      return state;
    }
  },
  
  universes: (state=_map, action) => {
    let newState;
    switch (action.type) {
      
    case 'SUCCESS_READ_UNIVERSE':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
  
    case 'SUCCESS_READ_UNIVERSES':
      newState = state;
      action.payload.forEach(universe => {
        if (!newState.get(universe.id)) newState = newState.set(universe.id, fromJSGreedy(universe));
      });
      return newState;
      
    case 'SUCCESS_READ_INVENTORY':
      const d = new Date();
      return state.setIn([action.params, 'lastInventoryUpdate'], d.getTime());
    
    case 'SUCCESS_CREATE_UNIVERSE':
      
    
    default:
      return state;
    }
  },
  
  chats: (state=_map, action) => {
    switch (action.type) {
      
    case 'SUCCESS_READ_CHAT':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
      
    default:
      return state;
    }
  },
  
  topics: (state=_map, action) => {
    let newState;
    switch (action.type) {
      
    case 'SUCCESS_READ_INVENTORY':
      newState = state;
      action.payload.forEach(topic => newState = newState.set(topic.id, fromJSGreedy(topic)));
      return newState;
      
    case 'SUCCESS_READ_TOPIC':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
      
    case 'SUCCESS_READ_TOPIC_CONTENT':
      return state.setIn([action.params, 'content'], fromJSGreedy(action.payload));
      
    case 'SUCCESS_CREATE_TOPIC':
      return state.set(action.params.id, fromJSGreedy(action.params));
      
    default:
      return state;
    }
  },
  
  router: (state={}, action) => routerStateReducer(state, action),
  
  // Doit être exporté en dernier pour activer les side effects après la reduction des précédants
  records: (state = [], action) => {
    const record = { date: new Date().getTime() };
    Object.keys(action).forEach(key => {
      if (action.hasOwnProperty(key)) record[key] = action[key];
    });
    return [...state, record];
  },

};
