import log from './logTailor.js';
import websocket from 'socket.io-client';
import { receiveMessage, receiveJoinChat, receiveLeaveChat } from '../actionCreators';
// Copié depuis https://github.com/gaearon/redux/blob/master/docs/middleware.md
// Modifié depuis

export default function sideEffectsMiddleware({ dispatch, getState }) {
  // log('.M. promiseMiddleware');
  
  let sockets = {};
  const logWs = (type, payload) => log('.W.', type, payload);
  
  return next => action => {
    const {type, payload} = action;
    
    let socket;
    
    switch (type) {
      
      case 'JOIN_CHAT':
        
        if (sockets['chat-universe-topic']) socket = sockets['chat-universe-topic'];
        else {
          socket = sockets['chat-universe-topic'] = websocket.connect('http://23.251.143.127:9090/chat-universe-topic');
        }
        
        logWs(type, payload);
        
        socket.emit('joinChat', payload);
        socket.on('receiveMessage', result => next(receiveMessage(result)));
        socket.on('receiveJoinChat', result => next(receiveJoinChat(result)));
        socket.on('receiveLeaveChat', result => next.dispatch(receiveLeaveChat(result)));
        socket.on('error', error => log('socket error', error));
        // socket.on('connect', () => log('socket connected to the namespace : chat-universe-topic'));
        break;
        
      case 'LEAVE_CHAT':
        socket = sockets['chat-universe-topic'];
        
        logWs(type, payload);
        
        socket.emit('leaveChat', payload);
        socket.removeListener('receiveMessage');
        socket.removeListener('receiveJoinChat');
        socket.removeListener('receiveLeaveChat');
        delete sockets['chat-universe-topic'];
        break;
        
      case 'CREATE_MESSAGE':
        socket = sockets['chat-universe-topic'];
        
        logWs(type, payload);
        
        socket.emit('createMessage', payload);
        break;
    }
    
    return next(action);
  };
}

