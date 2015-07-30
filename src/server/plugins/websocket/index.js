let Handlers = require('./handlers');
let SocketIo = require('socket.io');

// Le plugin Websocket pour Hapi
exports.register = function (server, options, next) {
    
  // creates websocket server using 'ws' defined port
  const io = new SocketIo(server.select('ws').listener);
  
  //before RabbitMQ implementation
  let userList = new WeakMap();
  
  //namespace for the chat of a universe or a topic
  const chat = io.of('/chat-universe-topic');
  let chatUsers = 0;
  chat.on('connection', (socket) => {
    chatUsers++;
    console.log('___ [' + chatUsers + '] New client connected in a chat universe | topic');
    
    socket.on('joinChat', function(request) {
      console.log(`___ ${request.userId} joining chat ${request.id}`);
      this.join(request.id);
      userList.set({userId: request.userId}, request);
      
      console.log('userList', userList);
      
      // send the current list of people in the chat to the user joining the chat
      this.emit('joinChat', userList);
      
      //send the user info to current people in the chat
      io.to(request.id).emit('joinChat', request);
    });

    socket.on('leaveChat', function(request) {
      console.log(`___ ${request.userId} leaving chat ${request.id}`);
      this.leave(request.id);
      userList.delete(socket);
      //send delete the current user list of people in the chat
      this.emit('leaveChat', userList);
      
      //send request to remove the user who left the chat from their list
      io.to(request.id).emit('leaveChat', request);
    });
    
    socket.on('createMessage', function(request) { 
      console.log('___ Got message', request);
      request.messageContent ? request.messageContent = JSON.parse(request.messageContent) : false;
      
      chat.in(request.id).emit('createMessage', request);
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