import log from './utils/logTailor';
import Immutable from 'immutable';
import { routerStateReducer } from 'redux-react-router';
import { isUnauthorized } from './actionCreators';
import config from '../../config/client';

const _map = Immutable.Map();

// From the Immutable.js Github wiki
const fromJSGreedy = js => typeof js !== 'object' || js === null ? js : Array.isArray(js) ? 
  Immutable.Seq(js).map(fromJSGreedy).toList() :
  Immutable.Seq(js).map(fromJSGreedy).toMap();


const reducers = {
  
  session: (state={}, action) => {
    log('.R. ' + action.type); // This line in first reducer
    
    if (isUnauthorized(action)) return {};
    switch (action.type) {
      
    case 'SET_REDIRECTION':
      const {userId, exp} = state;
      return {
        userId,
        exp,
        redirection: action.payload,
      };
      
    case 'SUCCESS_CREATE_USER':
      return {
        userId: action.payload.id,
        exp: new Date().getTime() + config.sessionDuration,
        redirection: state.redirection,
      };
    
    case 'SUCCESS_LOGIN':
      return {
        userId: action.payload.id,
        exp: new Date().getTime() + config.sessionDuration,
        redirection: state.redirection,
      };
    
    case 'SUCESS_LOGOUT':
      return {};
    
    default:
      return state;
    }
  },
  
  router: (state={}, action) => routerStateReducer(state, action),
  
  users: (state=_map, action) => {
    switch (action.type) {
      
    case 'SUCCESS_CREATE_USER':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
      
    case 'SUCCESS_LOGIN':
      return state.set(action.payload.id, fromJSGreedy(action.payload)); // le token est dedans !
      
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
  
  // Doit être exporté en dernier pour activer les side effects après la reduction des précédants
  records: (state = [], action) => {
    return [
      ...state,
      {action: action, date: new Date()}
    ];
  },

};

export default reducers;
