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
    switch (action.type) {
      
    case 'SUCCESS_READ_UNIVERSE':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
  
    case 'SUCCESS_READ_UNIVERSES':
      let newState = state;
      action.payload.forEach(universe => {
        if (!newState.get(universe.id)) newState = newState.set(universe.id, fromJSGreedy(universe));
      });
      return newState;
      
    case 'SUCCESS_READ_INVENTORY':
      const d = new Date();
      return state.setIn([action.params, 'lastInventoryUpdate'], d.getTime());
    
    case 'SUCCESS_CREATE_UNIVERSE':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
    
    default:
      return state;
    }
  },
  
  chats: (state=_map, action) => {
    /*switch (action.type) {
      
    case 'SUCCESS_READ_CHAT':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
      
    default:
      return state;
    }*/
    switch (action.type) {
      
    case 'SUCCESS_READ_CHAT':
      let {chatId} = action.payload && action.payload.chatId ? parseInt(action.payload.chatId, 10) : action.params ? parseInt(action.params, 10) : false;
      
      if(!action.payload.messages[0].id) action.payload.messages = [];
      return state.get(chatId) ?  state.mergeIn([chatId], fromJSGreedy(action.payload)) : state.set(chatId, fromJSGreedy(action.payload));          
        
    case 'CREATE_MESSAGE_LC':
      chatId = parseInt(action.payload.chatId, 10);
      
      action.payload.content = JSON.parse(action.payload.content);
      delete action.payload.chatId;
      
      if(!state.getIn([chatId, 'messages'])) console.log('table not defined'); state = state.setIn([chatId, 'messages'], fromJSGreedy([]));
      
      return state.setIn([chatId, 'messages'], state.getIn([chatId, 'messages']).push(fromJSGreedy(action.payload)));         
      
    case 'RECEIVE_MESSAGE':
      let {owner, message} = action.payload;
      console.log(action.payload);
      
      chatId = parseInt(action.payload.chatId, 10);
      
      if(owner){
        const messageId = parseInt(action.payload.message.id,10);
        const {content} = action.payload.message;
        const messageUserId = action.payload.message.userId;
        const messageIndex = state.getIn([chatId, 'messages']).indexOf(fromJSGreedy({messageId, messageUserId, content}));
        
        if (messageIndex !== -1) return state.setIn([chatId, 'messages', messageIndex], fromJSGreedy(message));
      } else {
        return state.setIn([chatId, 'messages'], state.getIn([chatId, 'messages']).push(fromJSGreedy(message)));
      }
      
      return state;
    
    case 'JOIN_CHAT_LC':
      let {userId} = action.payload;
      
      chatId = parseInt(action.payload.chatId, 10);
      
      if ( state.getIn([chatId, 'users']) ) return state.setIn([chatId, 'users'], state.getIn([chatId, 'users']).push(fromJSGreedy(userId)) );
      else {
        if ( state.get(chatId) ) return state.setIn([chatId, 'users'], fromJSGreedy([userId]));  
        else {
          return state.set(chatId, fromJSGreedy({users: [userId]}));          
        }
      }
            
    case 'RECEIVE_JOIN_CHAT':
      let {userList} = action.payload;
      
      chatId = parseInt(action.payload.chatId, 10);
      userId = action.payload.userId;
      owner = action.payload.owner;
      
      if (owner) return state.mergeIn([chatId, 'users'], fromJSGreedy(userList));
      else {
        return state.setIn( [chatId, 'users'], state.getIn([chatId, 'users']).push(fromJSGreedy(userId)) );
      }
    
    case 'LEAVE_CHAT_LC':
      chatId = parseInt(action.payload.chatId, 10);
      return state.deleteIn([chatId, 'users']);        
      
    case 'RECEIVE_LEAVE_CHAT':
      chatId = parseInt(action.payload.chatId, 10);
      userId = action.payload.userId;
      
      // remove the user from the user list
      return state.getIn([chatId, 'users']) && state.getIn([chatId, 'users']).size ? 
        state.setIn([chatId, 'users'], state.getIn([chatId, 'users']).filter( user => !(user === userId) )) :
        state;
      
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
      
    case 'SUCCESS_READ_TOPIC_ATOMS':
      return state.setIn([action.params, 'atoms'], fromJSGreedy(action.payload));
      
    case 'SUCCESS_CREATE_TOPIC':
      return state.set(action.payload.id, fromJSGreedy(action.payload));
      
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
