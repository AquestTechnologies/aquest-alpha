import log from './utils/logTailor';
import _cloneDeep from 'lodash.clonedeep';
import { sessionDuration } from '../../config/dev_shared';
import { routerStateReducer } from 'redux-react-router';
import { isAPIUnauthorized, isAPISuccess, isAPIFailure } from './actionCreators';

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
  
  chats: (state={}, action) => {
    const {type} = action;
    
    switch (type) {
      
    case 'SUCCESS_READ_CHAT_OFFSET':
      
      return ((action) => {
        const chatId = action.payload && action.payload.id ? parseInt(action.payload.id, 10) : action.params ? parseInt(action.params, 10) : false;
        const newState = _cloneDeep(state);
        
        if (action.payload.messages.length) newState[chatId].messages = action.payload.messages.concat(newState[chatId].messages);
        
        return newState;
      })(action);
      
    case 'SUCCESS_READ_CHAT':
      
      return ((action) => {
        const chatId = action.payload && action.payload.id ? parseInt(action.payload.id, 10) : action.params ? parseInt(action.params, 10) : false;
        const newState = _cloneDeep(state);
        newState[chatId] = Object.assign({}, newState[chatId], action.payload);
        
        return newState;
      })(action);
      
    case 'EMIT_CREATE_MESSAGE':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const newState = _cloneDeep(state);
        
        newState[chatId].messages.push(action.payload.message);
        
        return newState;
      })(action);
      
    case 'RECEIVE_MESSAGE_OWNER':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const { message, lcId } = action.payload;
        const messageIndex = state[chatId].messages.findIndex(({id}) => id === lcId);
        
        if (messageIndex !== -1) { 
          const newState = _cloneDeep(state);
          newState[chatId].messages[messageIndex] = message;
          
          return newState;
        }
        
        return state;
      })(action);
      
    case 'RECEIVE_MESSAGE':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const { message } = action.payload;
        const newState = _cloneDeep(state);
        
        newState[chatId].messages.push(message);
        
        return newState;
      })(action);
       
    case 'EMIT_JOIN_CHAT':
      
      return ((action) => {
        const chatId = parseInt(action.payload, 10);
        const newState = _cloneDeep(state);
        
        if (newState[chatId] && !newState[chatId].users) {
          newState[chatId] = Object.assign({}, newState[chatId], {users: []});
        } else if (!newState[chatId]) {
          newState[chatId] = {users: []};
        }
        
        return newState;        
      })(action);
            
    case 'RECEIVE_JOIN_CHAT_OWNER':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const { userList } = action.payload;
        const newState = _cloneDeep(state);
        
        newState[chatId] = Object.assign({}, newState[chatId], {users: userList});
        
        return newState;
      })(action);
      
    case 'RECEIVE_JOIN_CHAT':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const { userId } = action.payload;
        const newState = _cloneDeep(state);
        
        newState[chatId].users.push(userId);
        
        return newState;
      })(action);
    
    case 'EMIT_LEAVE_CHAT':
      
      return ((action) => {
        const chatId = parseInt(action.payload, 10);
        const newState = _cloneDeep(state);
        
        delete newState[chatId].users;  
        
        return newState;      
      })(action);
      
    case 'RECEIVE_LEAVE_CHAT':
      
      return ((action) => {
        const chatId = parseInt(action.payload.chatId, 10);
        const {userId} = action.payload;
        const newState = _cloneDeep(state);
        
        // remove the user from the user list
        if (newState[chatId].users && newState[chatId].users.length) newState[chatId].users.splice(newState[chatId].users.indexOf(userId), 1);
        
        return newState;
      })(action);
      
    case 'EMIT_CREATE_VOTE_MESSAGE':
      
      return ( (action) => {
        const {ballotId, voteTargetContext: {chatId, messageIndex}, sessionUserId} = action.payload;
        const newState = _cloneDeep(state);
        
        // if already exists revome, else add
        if(newState[chatId].messages[messageIndex].vote && newState[chatId].messages[messageIndex].vote[ballotId]) {
          const userVoteIndex = state[chatId].messages[messageIndex].vote[ballotId].findIndex( (userVote) => userVote.userId === sessionUserId );
          if( userVoteIndex !== -1 ) newState[chatId].messages[messageIndex].vote[ballotId].splice(userVoteIndex, 1);
          else newState[chatId].messages[messageIndex].vote[ballotId].push({userId: sessionUserId});
        } else {
          newState[chatId].messages[messageIndex].vote[ballotId] = [{userId: sessionUserId}];
        }
        
        console.log(newState[chatId]);
        
        return newState;
      })(action);
      
    case 'RECEIVE_VOTE_MESSAGE_OWNER':
      
      return ( (action) => {
        const {ballotId, chatId, messageIndex, vote, deleted } = action.payload;
        const userVoteIndex = state[chatId].messages[messageIndex].vote[ballotId].findIndex( ({userId}) => userId === vote.userId );
        
        if ( userVoteIndex !== -1 ) {
          const newState = _cloneDeep(state);
          if (deleted) newState[chatId].messages[messageIndex].vote[ballotId].splice(userVoteIndex, 1);
          else newState[chatId].messages[messageIndex].vote[ballotId][userVoteIndex] = vote;
          
          return newState;
        }
        
        return state;
      })(action);
      
    case 'RECEIVE_VOTE_MESSAGE':
      
      return ( (action) => {
        const {ballotId, chatId, messageId, vote, deleted} = action.payload;
        const messageIndex = state[chatId].messages.findIndex( (message) => message.id === messageId );
        
        if (messageIndex !== -1 && state[chatId].messages[messageIndex].vote && state[chatId].messages[messageIndex].vote[ballotId]) {
          const newState = _cloneDeep(state);
          if (deleted) {
            const userVoteIndex = state[chatId].messages[messageIndex].vote[ballotId].findIndex( ({userId}) => userId === vote.userId );
            if (userVoteIndex !== -1) newState[chatId].messages[messageIndex].vote[ballotId].splice(userVoteIndex, 1);
          } 
          else newState[chatId].messages[messageIndex].vote[ballotId].push(vote);
          
          return newState;
        }
        
        return state;
      })(action);
      
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
      
    case 'EMIT_CREATE_VOTE_TOPIC'  :
      
      return ( ({id, voteTargetContext: {topicId}, sessionUserId, universeId}) => {
        const newState = _cloneDeep(state);
        
        if (!newState[topicId].vote) {
          newState[topicId].vote = { 'Thanks': [], 'Agree': [], 'Disagree': [], 'Irrelevant': [], 'Shocking': [] };
          newState[topicId].vote[universeId] = [];
        }
          
        newState[topicId].vote[id].push(sessionUserId);
        
        return newState;
      })({payload});
      
    case 'RECEIVE_VOTE_TOPIC_OWNER':
      return ( ({id, topicId, userId, createdAt}) => {
        const newState = _cloneDeep(state);
        
        const userVoteIndex = newState[topicId].vote[id].findIndex( (userVote) => userVote.id === userId);
        if (userVoteIndex !== -1) newState[topicId].vote[id][userVoteIndex] = { id: userId, createdAt };
        
        return newState;
      })(payload);
      
    case 'RECEIVE_VOTE_TOPIC':
      return ( ({id, topicId, userId, createdAt}) => {
        const newState = _cloneDeep(state);
        
        if (!newState[topicId].vote) newState[topicId].vote = { 'Thanks': [], 'Agree': [], 'Disagree': [], 'Irrelevant': [], 'Shocking': [] };
        newState[topicId].vote[id].push({ id: userId, createdAt });
        
        return newState;
      })(payload);
      
    default:
      return state;
    }
  },
  
  lastError: (state=false, action) => isAPIFailure(action) ? action.payload : false,
  
  lastSuccess: (state='', { type }) => {
    if (type === 'SUCCESS_CREATE_TOPIC') return 'Topic creation success!';
    if (type === 'SUCCESS_CREATE_UNIVERSE') return 'Universe creation success!';
    return '';
  },
  
  router: (state={}, action) => routerStateReducer(state, action),
  
  // Doit être exporté en dernier pour activer les side effects après la reduction des précédants
  records: (state = [], action) => [...state, Object.assign({date: new Date().getTime()}, action)]
};
