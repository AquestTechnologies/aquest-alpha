import log from '../utils/logTailor.js';
import websocket from 'socket.io-client';
import { wsUrl } from '../../../config/dev_shared';
import { receiveMessage, receiveJoinChat, receiveLeaveChat } from '../actionCreators';

export default function websocketMiddleware({ dispatch, getState }) {
  
  const sockets = {};
  const logWs = (type, payload) => log('_w_', type, payload);
  
  return next => action => {
    
    let socket;
    const { type, payload } = action;
    
    switch (type) {
      
      case 'LOGOUT':
      case 'SUCCESS_LOGIN':
        for(let key in sockets){
          sockets[key].disconnect();
        }
        
        break;
        
      case 'JOIN_CHAT':
        logWs(type, payload);
        
        if (!sockets['chat']) sockets['chat'] = websocket.connect(`${wsUrl}/chat`);
        else if (sockets['chat'].disconnected) sockets['chat'] = websocket.connect(`${wsUrl}/chat`, {forceNew: true});
        
        socket = sockets['chat'];
        socket.emit('joinChat', payload);
        socket.on('receiveMessage', result => next(receiveMessage(result)));
        socket.on('receiveJoinChat', result => next(receiveJoinChat(result)));
        socket.on('receiveLeaveChat', result => next(receiveLeaveChat(result)));
        socket.on('connect_failed', () => log('connect_failed'));
        socket.on('disconnect', result => log(`.W. ${result}`));
        socket.on('error', error => typeof error === 'object' && error.message ? 
          next(receiveMessage(error)) : 
          log('!!! socket error', error));
        
        break;
        
      case 'LEAVE_CHAT':
        logWs(type, payload);
        
        socket = sockets['chat'];
        socket.emit('leaveChat', payload);
        socket.removeListener('receiveMessage');
        socket.removeListener('receiveJoinChat');
        socket.removeListener('receiveLeaveChat');
        
        break;
        
      case 'CREATE_MESSAGE':
        logWs(type, payload);
        
        socket = sockets['chat'];
        socket.emit('createMessage', payload);
        
        break;
    }
    
    return next(action);
  };
}
