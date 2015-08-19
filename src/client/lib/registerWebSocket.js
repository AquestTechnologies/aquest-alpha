import log  from '../../shared/utils/logTailor';
import { receiveMessage, receiveJoinChat, receiveLeaveChat } from '../../shared/actionCreators';
import websocket from 'socket.io-client';

export default function registerWebSocket(store) {
  
  let sockets = {};

  store.subscribe(() => {
    const { records } = store.getState();
    const action = records[records.length - 1];
    const { type, payload } = action;
    let socket;
    
    console.log('.WS.', type);
    
    switch (type) {
      
      case 'JOIN_CHAT':
        
        if (sockets['chat-universe-topic']) socket = sockets['chat-universe-topic'];
        else {
          socket = sockets['chat-universe-topic'] = websocket.connect('http://23.251.143.127:9090/chat-universe-topic');
        }
        
        socket.emit('joinChat', payload);
        socket.on('receiveMessage', result => store.dispatch(receiveMessage(result)));
        socket.on('receiveJoinChat', result => store.dispatch(receiveJoinChat(result)));
        socket.on('receiveLeaveChat', result => store.dispatch(receiveLeaveChat(result)));
        socket.on('error', error => log('socket error', error));
        // socket.on('connect', () => log('socket connected to the namespace : chat-universe-topic'));
        
        return;
        
      case 'LEAVE_CHAT':
        
        socket = sockets['chat-universe-topic'];
        socket.emit('leaveChat', payload);
        socket.removeListener('receiveMessage');
        socket.removeListener('receiveJoinChat');
        socket.removeListener('receiveLeaveChat');
        delete sockets['chat-universe-topic'];
        
        return;
        
      case 'CREATE_MESSAGE':
        
        socket = sockets['chat-universe-topic'];
        socket.emit('createMessage', payload);
        
        return;
        
      default:  
        return;
    }
  });
}
