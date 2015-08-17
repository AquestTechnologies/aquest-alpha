import log  from '../../shared/utils/logTailor';
import websocket from 'socket.io-client';
import { receiveMessage, receiveJoinChat, receiveLeaveChat } from '../../shared/actionCreators';

export default function registerWebSocket(store, transitionTo) {
  
  const logR = type => log('.WS. registerWebSocket redirecting after', type);

  store.subscribe(() => {
    const { records, router, session } = store.getState();
    const action = records[records.length - 1];
    const { type, payload } = action;
    
    switch (type) {
      
      case 'JOIN_CHAT_LC':
        logR(type);
        const socket = websocket.connect('http://23.251.143.127:9090/chat-universe-topic');
        socket.emit('joinChat', action.payload);
        
        socket.on('receiveMessage', result => receiveMessage(result));
        socket.on('receiveJoinChat', result => receiveJoinChat(result));
        socket.on('receiveLeaveChat', result => receiveLeaveChat(result));
        return;
        
      case 'LEAVE_CHAT_LC':
        logR(type);
        socket.emit('leaveChat', action.payload);
        socket.removeListener('receiveMessage');
        socket.removeListener('receiveJoinChat');
        socket.removeListener('receiveLeaveChat');
        return;
        
      case 'CREATE_MESSAGE_LC':
        logR(type);
        socket.emit('createMessage', action.payload);
        return;
      
    }
  });
}
