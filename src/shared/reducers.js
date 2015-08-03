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
  switch (action.type) {
    
  case 'SUCCESS_READ_CHAT':
    action.payload.isUpToDate = true;
    if(!action.payload.messages[0].id){ 
      action.payload.messages = Immutable.List();
    } else {
      action.payload.messages = Immutable.List.of(action.payload.messages);
    }
    const readChatId = parseInt(action.payload.id , 10);
    console.log(action.payload);
    console.log(Immutable.fromJS(action.payload));
    return state.mergeIn([readChatId], Immutable.fromJS(action.payload));
    
  case 'SUCCESS_CREATE_MESSAGE':
    const createChatId = parseInt(action.params.chatId , 10);
    //should work as latence compensation !
    if(!action.params.from && action.params.from !== 'server'){
      console.log('is list ', Immutable.List.isList(state.getIn([createChatId, 'messages'])));
      return state.getIn([createChatId, 'messages']).push(fromJSGreedy(action.params)); 
    } else {
      return state.mergeIn([createChatId, 'messages'], fromJSGreedy(action.params.message));
    }
    
  case 'SUCCESS_JOIN_CHAT':
    
    const joinChatId = parseInt(action.params.chatId, 10);
    if(!action.params.from && action.params.from !== 'server'){
      // push user in the userList
      if( state.getIn([joinChatId, 'users']) ) {
        console.log('userList exist');
        return state.getIn([joinChatId, 'users']).push(fromJSGreedy(action.params.userId));
      } else {
        console.log('createUser list');
        if(!state.get(joinChatId)){
          console.log('setting the chat and users');
          return state.set(joinChatId, Immutable.Map({users: Immutable.List.of(action.params.userId)}));  
        } else {
          console.log('setting users in chat');
          return state.setIn([joinChatId, 'users'], Immutable.List.of(action.params.userId));          
        }
      }
    } else {
      if(action.params.userList){
        return state.mergeIn([joinChatId, 'users'], Immutable.List.of(action.params.userList));
      } else {
        console.log('delet user');
        return state.deleteIn([joinChatId, 'users']);
      }
    }
    
  case 'SUCCESS_LEAVE_CHAT':
    
    if(!action.params.from && action.params.from !== 'server'){
      const leaveChatId = parseInt(action.params.chatId, 10);
      
      state.updateIn([leaveChatId, 'isUpToDate'], false);
      state.setIn([leaveChatId, 'users'],
        state.getIn([leaveChatId, 'users']).filter(function(user) {
          console.log(user !== action.params.userId ? 'not equal' : 'equal');
          return user !== action.params.userId;
        })
      )
    } else {
      return state.mergeIn([joinChatId, 'users'], fromJSGreedy(action.params.userList) );
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
