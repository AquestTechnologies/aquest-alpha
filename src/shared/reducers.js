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
      return state.set(action.payload.id, fromJSGreedy(action.payload));
    
    default:
      return state;
    }
  },
  
  chats: (state=_map, action) => {
    // the chat reducer always recieve a chatId -- action.params && action.params.chatId not checked here because there is no 'REQUEST' case
    const chatId  = action.payload && action.payload.chatId ? parseInt(action.payload.chatId, 10) : action.params ? parseInt(action.params, 10) : false;
    
    const userId = action.payload && action.payload.userId ? action.payload.userId : false;
    
    //property 'from' & 'owner' send by the server using websocket 
    // from   --> does the SUCCESS action comes from the server
    // owner  --> does the SUCCESS action comes from the confirmation of a user action, or does it comes from another user
    const local = action.payload && action.payload.fromServer ? false : true;
    const owner   = action.payload && action.payload.owner ? true : false;
    
    if (chatId){
      switch (action.type) {
        
      case 'SUCCESS_READ_CHAT':
        
        action.payload.isUpToDate = true;
        
        if(!action.payload.messages[0].id) action.payload.messages = [];
        
        return state.get(chatId) ?  state.mergeIn([chatId], fromJSGreedy(action.payload)) : state.set(chatId, fromJSGreedy(action.payload));          
          
        
      case 'SUCCESS_CREATE_MESSAGE':
        
        //should work as latence compensation !
        if(local) {
          action.params.content = JSON.parse(action.params.content);
          delete action.params.chatId;
          
          return state.setIn([chatId, 'messages'], state.getIn([chatId, 'messages']).push(fromJSGreedy(action.params))); 
        } else {
          if(owner){
            const messageId = parseInt(action.payload.message.id,10);
            const {content} = action.payload.message;
            const messageUserId = action.payload.message.userId;
            const messageIndex = state.getIn([chatId, 'messages']).indexOf(fromJSGreedy({messageId, messageUserId, content}));
            
            if (messageIndex !== -1) return state.setIn([chatId, 'messages', messageIndex], fromJSGreedy(action.payload.message));
          } else {
            return state.setIn([chatId, 'messages'], state.getIn([chatId, 'messages']).push(fromJSGreedy(action.payload.message)));
          }
        }
        
        return state;
        
      case 'SUCCESS_JOIN_CHAT':
        
        if (local){
          if ( state.getIn([chatId, 'users']) ) return state.setIn([chatId, 'users'], state.getIn([chatId, 'users']).push(fromJSGreedy(userId)) );
          else {
            if ( state.get(chatId) ) return state.setIn([chatId, 'users'], fromJSGreedy([userId]));  
            else {
              return state.set(chatId, fromJSGreedy({users: [userId]}));          
            }
          }
        } else {
          if (owner) return state.mergeIn([chatId, 'users'], fromJSGreedy(action.payload.userList));
          else {
            return state.setIn( [chatId, 'users'], state.getIn([chatId, 'users']).push(fromJSGreedy(userId)) );
          }
        }
        
      case 'SUCCESS_LEAVE_CHAT':
        
        // the chat won't be up to date anymore !
        if (local) state = state.updateIn([chatId, 'isUpToDate'], value => false);
          
        // remove the user from the user list
        return state.getIn([chatId, 'users']) && state.getIn([chatId, 'users']).size ? 
          state.setIn([chatId, 'users'], state.getIn([chatId, 'users']).filter( user => !(user === userId) )) :
          state;
        
      default:
        return state;
      }
    }
    
    return state;
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
