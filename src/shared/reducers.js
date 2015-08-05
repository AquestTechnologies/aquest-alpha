import log from './utils/logTailor';
import Immutable from 'immutable';

// Doit être exporté en premier pour logger avant les autres
export function records(state = [], action) {
  log('.R. ' + action.type);
  return [
    ...state,
    {action: action, date: new Date()}
  ];
}

export function universes(state = Immutable.Map(), action) {
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
}

export function chats(state = Immutable.Map(), action) {
  
  // the chat reducer always recieve a chatId -- action.params && action.params.chatId not checked here because there is no 'REQUEST' case
  const chatId  = action.payload && action.payload.chatId ? parseInt(action.payload.chatId, 10) : action.params ? parseInt(action.params, 10) : false;
  
  const userId = action.payload && action.payload.userId ? action.payload.userId : false;
  
  //property 'from' send by the server using websocket 
  const local = action.payload && action.payload.fromServer ? false : true;
  const owner   = action.payload && action.payload.owner ? true : false;
  
  if(chatId){
    switch (action.type) {
      
    case 'SUCCESS_READ_CHAT':
      
      action.payload.isUpToDate = true;
      if(!action.payload.messages[0].id){ 
        console.log('no messages');
        action.payload.messages = [];
      }
      return state.mergeIn([chatId], fromJSGreedy(action.payload));
      
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
          if (messageIndex !== -1){
            console.log('latency compensation');
            return state.setIn([chatId, 'messages', messageIndex], fromJSGreedy(action.payload.message));
          } 
        } else {
          console.log('Message from another user');
          return state.setIn([chatId, 'messages'], state.getIn([chatId, 'messages']).push(fromJSGreedy(action.payload.message)));
        }
      }
      
      return state;
      
    case 'SUCCESS_JOIN_CHAT':
      
      if (local){
        if ( state.getIn([chatId, 'users']) ) {
          return state.setIn([chatId, 'users'], state.getIn([chatId, 'users']).push(fromJSGreedy(userId)) );
        } else {
          if ( state.get(chatId) ){
            return state.setIn([chatId, 'users'], fromJSGreedy([userId]));  
          } else {
            return state.set(chatId, Immutable.Map({users: fromJSGreedy([userId])}));          
          }
        }
      } else {
        if (owner){
          return state.mergeIn([chatId, 'users'], fromJSGreedy(action.params.userList));
        } else {
          return state.setIn( [chatId, 'users'], state.getIn([chatId, 'users']).push(fromJSGreedy(userId)) );
        }
      }
      
    case 'SUCCESS_LEAVE_CHAT':
      
      if(local){
        // the chat won't be up to date anymore !
        state = state.updateIn([chatId, 'isUpToDate'], value => false);
      }
      
      // remove the user from the user list
      return state = state.setIn([chatId, 'users'],
        state.getIn([chatId, 'users']).filter((user) => {
          console.log('user', user, 'userId', userId);
          console.log(!(user === userId) ? 'not equal' : 'equal');
          return !(user === userId);
        })
      );
      
    default:
      return state;
    }
  }
  
  return state;
}

export function topics(state = Immutable.Map(), action) {
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
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  default:
    return state;
  }
}

export function users(state = Immutable.Map(), action) {
  
  switch (action.type) {
    
  case 'SUCCESS_CREATE_USER':
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  case 'SUCCESS_LOGIN':
    return state.set(action.payload.id, fromJSGreedy(action.payload)); // le token est dedans !
    
  default:
    return state;
  }
}

// From the Immutable.js Github wiki
function fromJSGreedy(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ? 
      Immutable.Seq(js).map(fromJSGreedy).toList() :
      Immutable.Seq(js).map(fromJSGreedy).toMap();
}
