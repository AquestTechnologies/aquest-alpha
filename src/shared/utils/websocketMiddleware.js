import log from './logTailor.js';
import config from '../../../config/dev_shared';
import websocket from 'socket.io-client';
import { receiveMessage, receiveJoinChat, receiveLeaveChat } from '../actionCreators';

export default function websocketMiddleware({ dispatch, getState }) {
  // log('.M. promiseMiddleware');
  
  const sockets = {};
  const logWs = (type, payload) => log('.W.', type, payload);
  
  return next => action => {
    const {type, payload} = action;
    
    let socket;
    
    switch (type) {
      
      case 'SUCCESS_LOGIN':
        for(let key in sockets){
          sockets[key].disconnect();
        }
        break;
      
      case 'JOIN_CHAT':
        
        if (sockets['chat-universe-topic']) socket = sockets['chat-universe-topic'];
        else {
          socket = sockets['chat-universe-topic'] = websocket.connect(`${config.wsUrl}/chat-universe-topic`);
        }
        
        if (socket.disconnected) socket = sockets['chat-universe-topic'] = websocket.connect(`${config.wsUrl}/chat-universe-topic`, {forceNew: true});
        
        logWs(type, payload);
        
        socket.emit('joinChat', payload);
        socket.on('receiveMessage', result => next(receiveMessage(result)));
        socket.on('receiveJoinChat', result => next(receiveJoinChat(result)));
        socket.on('receiveLeaveChat', result => next(receiveLeaveChat(result)));
        socket.on('error', error => typeof error === 'object' && error.message ? next(receiveMessage(error)) : log('!!! socket error', error));
        socket.on('connect_failed', () => log('connect_failed'));
        socket.on('disconnect', () => log('.W. websocket disconnected from server'));
        break;
        
      case 'LEAVE_CHAT':
        socket = sockets['chat-universe-topic'];
        
        logWs(type, payload);
        
        socket.emit('leaveChat', payload);
        socket.removeListener('receiveMessage');
        socket.removeListener('receiveJoinChat');
        socket.removeListener('receiveLeaveChat');
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

