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
    return state.set(action.payload.id, fromJSGreedy(action.payload));
    
  case 'SUCCESS_CREATE_MESSAGE':
    //should work as latence compensation !
    if(state.action){
      // here we use params
      if(state.action === 'emit'){
        return state.set(action.params.id, fromJSGreedy(action.params)); 
      } else {
        // Todo : check if the message in the redux state is equal to the payload
        log('Roger that : ', action.paylaod)
      }
    }
    
  case 'SUCCESS_JOIN_CHAT':
    log(state);
    //should work as latence compensation !
    if(state.socketAction){
      // here we use params
      if(state.socketAction === 'emit'){
        // push user in the userList
        const joinChatId = parseInt(action.params.id, 10);
        return state.getIn([joinChatId, 'users']) ? state.getIn([joinChatId, 'users']).push(fromJSGreedy(action.params.userId)) : state.setIn([joinChatId, 'users'], Immutable.List.of(action.params.userId));
      } else {
        // Todo : check if the user is in the userList (it should be !)
        // if there is an error, or the payload is empty, remove the user from the table
        // else, everything is alright
        log('Roger that : ', action.paylaod)
        
        // const joinChatId = parseInt(action.payload.id, 10);
        // return state.getIn([joinChatId, 'users']) ? state.getIn([joinChatId, 'users']).push(fromJSGreedy(action.payload.userId)) : state.setIn([joinChatId, 'users'], Immutable.List.of(action.payload.userId));    
      }
    }
    
  case 'SUCCESS_LEAVE_CHAT':
    
    if(state.socketAction){
      // here we use params
      if(state.socketAction === 'emit'){
        const leaveChatId = parseInt(action.params.id, 10);
        return state.setIn([leaveChatId, 'users'],
          state.getIn([leaveChatId, 'users']).filter(function(user) {
            console.log(user !== action.params.userId ? 'not equal' : 'equal');
            return user !== action.params.userId;
          })
        )
      } else {
        
        log('Roger that : ', action.paylaod);
        // const leaveChatId = parseInt(action.payload.id, 10);
        // return state.setIn([leaveChatId, 'users'],
        //   state.getIn([leaveChatId, 'users']).filter(function(user) {
        //     console.log(user !== action.payload.userId ? 'not equal' : 'equal');
        //     return user !== action.payload.userId;
        //   })
        // )
      }
    }
    // return state.set(action.payload.id, fromJSGreedy(false));
    
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
