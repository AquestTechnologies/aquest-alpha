import log from '../utils/logTailor.js';
import websocket from 'socket.io-client';
import { wsUrl } from '../../../config/dev_shared';
import { 
  receiveMessage, receiveMessageOwner, receiveJoinChat, receiveJoinChatOwner, receiveLeaveChat,
  receiveVoteMessage, receiveVoteMessageOwner 
} from '../actionCreators';

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
        
      case 'EMIT_JOIN_CHAT':
        logWs(type, payload);
        
        if (!sockets['chat']) sockets['chat'] = websocket.connect(`${wsUrl}/chat`);
        else if (sockets['chat'].disconnected) sockets['chat'] = websocket.connect(`${wsUrl}/chat`, {forceNew: true});
        
        socket = sockets['chat'];
        socket.emit('joinChat', payload);
        socket.on('receiveMessage', result => next(receiveMessage(result)));
        socket.on('receiveJoinChat', result => next(receiveJoinChat(result)));
        socket.on('receiveLeaveChat', result => next(receiveLeaveChat(result)));
        socket.on('receiveMessageOwner', result => next(receiveMessageOwner(result)));
        socket.on('receiveJoinChatOwner', result => next(receiveJoinChatOwner(result)));
        
        socket.on('connect_failed', () => log('connect_failed'));
        socket.on('disconnect', result => log(`.W. ${result}`));
        socket.on('error', error => typeof error === 'object' && error.message ? 
          next(receiveMessageOwner(error)) : 
          log('!!! socket error', error));
        
        break;
        
      case 'EMIT_LEAVE_CHAT':
        logWs(type, payload);
        
        socket = sockets['chat'];
        socket.emit('leaveChat', payload);
        socket.removeListener('receiveMessage');
        socket.removeListener('receiveMessageOwner');
        socket.removeListener('receiveJoinChat');
        socket.removeListener('receiveJoinChatOwner');
        socket.removeListener('receiveLeaveChat');
        
        break;
        
      case 'EMIT_CREATE_MESSAGE':
        logWs(type, payload);
        
        socket = sockets['chat'];
        socket.emit('createMessage', payload);
        
        break;
        
      case 'EMIT_JOIN_VOTE':
        logWs(type, payload);
        
        if (!sockets['vote']) sockets['vote'] = websocket.connect(`${wsUrl}/vote`);
        else if (sockets['vote'].disconnected) sockets['vote'] = websocket.connect(`${wsUrl}/vote`, {forceNew: true});
        
        socket = sockets['vote'];
        socket.emit('joinVote', payload);
        socket.on('receiveVoteMessage', result => next(receiveVoteMessage(result)));
        socket.on('receiveVoteMessageOwner', result => next(receiveVoteMessageOwner(result)));
        
        break;
        
      case 'EMIT_LEAVE_VOTE':
        logWs(type, payload);
        
        socket = sockets['vote'];
        
        socket.removeListener('receiveVoteMessage');
        socket.removeListener('receiveVoteMessageOwner');
        
        break;
        
      case 'EMIT_CREATE_VOTE_MESSAGE':
        logWs(type, payload);
        
        socket = sockets['vote'];
        
        const { id, voteTargetContext } = payload;
        socket.emit('createVoteMessage', {id, voteTargetContext});
        
        break;
        
      case 'EMIT_DELETE_VOTE_MESSAGE':
        logWs(type, payload);
        
        socket = sockets['vote'];
        
        socket.emit('deleteVoteMessage', payload);
        
        break;
    }
    
    return next(action);
  };
}
