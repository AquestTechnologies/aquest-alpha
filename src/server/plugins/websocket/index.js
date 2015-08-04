let Handlers = require('./handlers');
let SocketIo = require('socket.io');

// Le plugin Websocket pour Hapi
exports.register = function (server, options, next) {
    
  // creates websocket server using 'ws' defined port
  const io = new SocketIo(server.select('ws').listener);
  
  //before RabbitMQ implementation
  // let userList = new WeakMap();
  let chatList = {};
  
  const from = 'server';
  
  //namespace for the chat of a universe or a topic
  const chat = io.of('/chat-universe-topic');
  let chatUsers = 0;
  chat.on('connection', (socket) => {
    chatUsers++;
    console.log('___ [' + chatUsers + '] New client connected in a chat universe | topic');
    
    socket.on('joinChat', function(request) {
      const {chatId} = request;
      
      console.log(request);
      console.log(`___ ${request.userId} joining chat ${chatId}`);
      this.join(chatId);
      // userList.set({userId: request.userId}, request);
      let userList = Array.isArray(chatList[chatId]) ? chatList[chatId] : chatList[chatId] = [];
      userList.push(request.userId);
      
      console.log('userList', userList);
      
      
      // send the current list of people in the chat to the user joining the chat
      this.emit('joinChat', { from, chatId, userList });
      
      //send the user info to current people in the chat
      socket.broadcast.to(chatId).emit('joinChat', { from, chatId, userList });
    });

    socket.on('leaveChat', function(request) {
      const {chatId} = request;
      
      console.log(`___ ${request.userId} leaving chat ${chatId}`);
      this.leave(chatId);
      // userList.delete(socket);
      let userList = Array.isArray(chatList[chatId]) ? chatList[chatId] : chatList[chatId] = [];
      userList.splice(userList.indexOf(request.userId), 1);
      
      //send request to remove the user who left the chat from their list
      socket.broadcast.to(chatId).emit('leaveChat', { from, chatId, userList });
    });
    
    socket.on('createMessage', function(request) { 
      const {chatId, id, userId} = request;
      
      console.log('___ Got message', request);
      const content = request.content ? JSON.parse(request.content) : false;
      
      const d = new Date();
      this.emit('createMessage', { from, chatId, message: { id, userId, content, timestamp: d.getTime()} });
      
      socket.broadcast.to(chatId).emit('createMessage', { from, chatId, message: { id, userId, content, timestamp: d.getTime()} });
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