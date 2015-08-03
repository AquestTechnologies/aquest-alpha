let Handlers = require('./handlers');
let SocketIo = require('socket.io');

// Le plugin Websocket pour Hapi
exports.register = function (server, options, next) {
    
  // creates websocket server using 'ws' defined port
  const io = new SocketIo(server.select('ws').listener);
  
  //before RabbitMQ implementation
  // let userList = new WeakMap();
  let userList = [];
  
  //namespace for the chat of a universe or a topic
  const chat = io.of('/chat-universe-topic');
  let chatUsers = 0;
  chat.on('connection', (socket) => {
    chatUsers++;
    console.log('___ [' + chatUsers + '] New client connected in a chat universe | topic');
    
    socket.on('joinChat', function(request) {
      console.log(request);
      console.log(`___ ${request.userId} joining chat ${request.chatId}`);
      this.join(request.chatId);
      // userList.set({userId: request.userId}, request);
      userList.push(request.userId);
      
      console.log('userList', userList);
      
      // send the current list of people in the chat to the user joining the chat
      this.emit('joinChat', { from: 'server', chatId: request.chatId, userList });
      
      //send the user info to current people in the chat
      // io.to(request.chatId).emit('joinChat', request);
    });

    socket.on('leaveChat', function(request) {
      console.log(`___ ${request.userId} leaving chat ${request.chatId}`);
      this.leave(request.chatId);
      // userList.delete(socket);
      userList.splice(userList.indexOf(request.userId), 1);
      //send delete the current user list of people in the chat
      this.emit('leaveChat', { from: 'server', userList });
      
      //send request to remove the user who left the chat from their list
      // io.to(request.chatId).emit('leaveChat', request);
    });
    
    socket.on('createMessage', function(request) { 
      console.log('___ Got message', request);
      request.messageContent ? request.messageContent = JSON.parse(request.messageContent) : false;
      
      const d = new Date();
      this.emit('createMessage', { from: 'server', chatId: request.chatId, message: {id: request.chatId, author: request.userId, content: request.messageContent, timestamp: d.getTime()}});
      
      // io.to(request.chatId).emit('createMessage', request);
    });
    
    socket.on('disconnect', (socket) => {
      chatUsers--;
      console.log('___ [' + chatUsers + '] A client disconnected from a chat universe | topic');
    })
  });
  
  /**
   * Should we really use socketio to vote ?
   * namespace to vote for a topic/message
   * */
  const vote = io.of('/vote');
  let voteUsers = 0;
  vote.on('connection', (socket) => {
      voteUsers++;
      console.log('___ [' + voteUsers + '] New client is able to vote for a topic | message');
      
      socket.on('createVote', Handlers.createVote);
      
      socket.on('disconnect', (socket) => {
        voteUsers--;
        console.log('___ [' + voteUsers + '] A client disconnected from voting for a topic | message');
      })
  });

  next();
};

exports.register.attributes = {
  name: 'hapi-ws'
};