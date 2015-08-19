import log from './utils/logTailor';
import config from '../../config/client';
import { routerStateReducer } from 'redux-react-router';
import { isAPIUnauthorized, isAPISuccess } from './actionCreators';
import _findIndex from 'lodash/array/findIndex';
import _isEqual from 'lodash/lang/isEqual';
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
  
  chats: (state={}, action) => {
    let newState;
    const {type} = action;
    
    switch (type) {
      
    case 'SUCCESS_READ_CHAT':
      
      return ((action) => {
        const chatId = action.payload && action.payload.id ? parseInt(action.payload.id, 10) : action.params ? parseInt(action.params, 10) : false;
        
        newState = deepCopy(state);
        
        if (newState[chatId]) newState[chatId] = fuse(newState[chatId], action.payload);
        else {
          newState[chatId] = action.payload;
        }
        
        return newState;                    
      })(action);
      
    case 'CREATE_MESSAGE':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        
        newState = deepCopy(state);
        
        let newPayload = deepCopy(action.payload);
        delete newPayload.chatId;
        
        newState[chatId].messages.push(newPayload);
        
        return newState;
        
      })(action);
      
    case 'RECEIVE_MESSAGE':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const {owner, message} = action.payload;
        
        newState = deepCopy(state);
        
        if(owner){
          const id = parseInt(action.payload.message.id,10);
          const {content, userId} = message;
          const messageIndex = _findIndex(newState[chatId].messages, (val) => !val.id ); // the latency compensation message doesn't have id 
          
          if (messageIndex !== -1) { 
            newState[chatId].messages[messageIndex] = message; // must enable the ui that the message was succesfully delivered or not
            return newState;
          }
          
          return state;
        } else {
          newState[chatId].messages.push(message);
          return newState;
        }
      })(action);
       
    case 'JOIN_CHAT':
      
      return ((action) => {
        const chatId = parseInt(action.payload, 10);
        
        newState = deepCopy(state);
        
        if (newState[chatId] && !newState[chatId].users) {
          newState = merge(newState[chatId], {users: []});
        } else if (!newState[chatId]) {
          newState[chatId] = {users: []};
        }
        
        return newState;        
      })(action);
            
    case 'RECEIVE_JOIN_CHAT':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const {userList, userId, owner} = action.payload;
        
        newState = deepCopy(state);
        
        console.log('RECEIVE_JOIN_CHAT', newState, 'userList', userList);
        
        if (owner) newState = merge(newState[chatId], {users: userList});
        else {
          newState[chatId].users.push(userId);
        }   
        
        return newState;
      })(action);
    
    case 'LEAVE_CHAT':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        
        newState = deepCopy(state);
        delete newState[chatId].users;  
        
        return newState;      
      })(action);
      
    case 'RECEIVE_LEAVE_CHAT':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const {userId} = action.payload;
        
        newState = deepCopy(state);
        
        // remove the user from the user list
        newState[chatId].users && newState[chatId].users.length ?
          newState.splice(newState[chatId].users.indexOf(userId), 1) :
          state; 
        
        return newState;
          
      })(action);
      
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
