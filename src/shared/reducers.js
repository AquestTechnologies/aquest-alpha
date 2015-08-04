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
  let newState;
  const chatId = action.params && action.params.chatId ? parseInt(action.params.chatId, 10) : action.payload && action.payload.chatId ? parseInt(action.payload.chatId, 10) : false;
  
  switch (action.type) {
    
  case 'SUCCESS_READ_CHAT':
    console.log(chatId);
    
    action.payload.isUpToDate = true;
    if(!action.payload.messages[0].id){ 
      console.log('no messages');
      action.payload.messages = [];
    }
    return state.mergeIn([chatId], fromJSGreedy(action.payload));
    // console.log('messages list ?', Immutable.List.isList(newState.getIn([chatId, 'messages'])) );
    // console.log('newState', newState );
    // return newState;
    
  case 'SUCCESS_CREATE_MESSAGE':
    
    //should work as latence compensation !
    if(!action.params.from && action.params.from !== 'server'){
      action.params.content = JSON.parse(action.params.content);
      delete action.params.chatId;
      return state.setIn([chatId, 'messages'], state.getIn([chatId, 'messages']).push(fromJSGreedy(action.params))); 
    } else {
      const id = parseInt(action.payload.message.id,10);
      const {userId, content} = action.payload.message;
      const messageIndex = state.getIn([chatId, 'messages']).indexOf(fromJSGreedy({id, userId, content}));
      if (messageIndex !== -1){
        console.log('latency compensation');
        return state.setIn([chatId, 'messages', messageIndex], fromJSGreedy(action.payload.message));
      } else {
        console.log('Message from another user');
        return state.setIn([chatId, 'messages'], state.getIn([chatId, 'messages']).push(fromJSGreedy(action.payload.message)));
      }
    }
    
  case 'SUCCESS_JOIN_CHAT':
    console.log(chatId);
    
    if(!action.params.from && action.params.from !== 'server'){
      // push user in the userList
      if( state.getIn([chatId, 'users']) ) {
        console.log('userList exist');
        return state.setIn([chatId, 'users'], state.getIn([chatId, 'users']).push(fromJSGreedy(action.params.userId)) );
      } else {
        console.log('createUser list');
        if(!state.get(chatId)){
          console.log('setting the chat and the user', action.params.userId);
          return state.set(chatId, Immutable.Map({users: fromJSGreedy([action.params.userId])}));  
        } else {
          console.log('setting users in chat');
          return state.setIn([chatId, 'users'], fromJSGreedy([action.params.userId]));          
        }
      }
    } else {
      if(action.params.userList){
        return state.mergeIn([chatId, 'users'], fromJSGreedy([action.params.userList]));
      } else {
        console.log('delet user');
        return state.deleteIn([chatId, 'users']);
      }
    }
    
  case 'SUCCESS_LEAVE_CHAT':
    
    if(!action.params.from && action.params.from !== 'server'){
      newState = state.updateIn([chatId, 'isUpToDate'], value => false);
      return newState = newState.setIn([chatId, 'users'],
        newState.getIn([chatId, 'users']).filter((user) => {
          console.log('user', user, 'userId', action.params.userId);
          console.log(!(user === action.params.userId) ? 'not equal' : 'equal');
          return !(user === action.params.userId);
        })
      )
    } else {
      return state.setIn([chatId, 'users'], fromJSGreedy(action.params.userList) );
    }
    
  default:
    return state;
  }
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
