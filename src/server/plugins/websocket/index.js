import Handlers from './handlers';
import Joi      from 'joi';
import SocketIo from 'socket.io';
import {WEBSOCKET_VALIDATION_SCHEMA as validationSchema} from '../../validationSchema.js';

// Le plugin Websocket pour Hapi
exports.register = function (server, options, next) {
    
  // creates websocket server using 'ws' defined port
  const io = new SocketIo(server.select('ws').listener);
  
  //before RabbitMQ implementation
  // let userList = new WeakMap(); --> Doesn't work at the moment
  let chatList = {};
  
  const fromServer = true;
  const owner = true;
  
  //namespace for the chat of a universe or a topic
  const chat = io.of('/chat-universe-topic');
  let chatUsers = 0;
  chat.on('connection', (socket) => {
    chatUsers++;
    console.log('___ [' + chatUsers + '] New client connected in a chat universe | topic');
    
    socket.on('joinChat', function(request) {
      console.log(`___ ${request.userId} joining chat ${request.chatId}`);
      
      Joi.validate(request, validationSchema['joinChat'], (err, value) => {
        
        if (err) throw err;
          
        const {chatId, userId} = request;
        
        this.join(chatId);
        // userList.set({userId: request.userId}, request);
        let userList = Array.isArray(chatList[chatId]) ? chatList[chatId] : chatList[chatId] = [];
        userList.push(userId);
        
        console.log('userList up to date', userList);
        
        
        // send the current list of people in the chat to the user joining the chat
        this.emit('joinChat', { fromServer, owner, chatId, userList });
        
        //send the user info to current people in the chat
        socket.broadcast.to(chatId).emit('joinChat', { fromServer, chatId, userId });
      });
    });

    socket.on('leaveChat', function(request) {
      console.log(`___ ${request.userId} leaving chat ${request.chatId}`);
      
      Joi.validate(request, validationSchema['leaveChat'], (err, value) => {
        
        if (err) throw err;
        
        const {chatId, userId} = request;
        
        this.leave(chatId);
        // userList.delete(socket);
        let userList = Array.isArray(chatList[chatId]) ? chatList[chatId] : chatList[chatId] = [];
        userList.splice(userList.indexOf(request.userId), 1);
        
        //send request to remove the user who left the chat from their list
        socket.broadcast.to(chatId).emit('leaveChat', { fromServer, chatId, userId });
      });
    });
    
    socket.on('createMessage', function(request) {
      console.log('___ Got message', request);
      
      Joi.validate(request, validationSchema['createMessage'], (err, value) => {
        
        if (err) throw err;
        
        const {chatId, id, userId} = request;
        const content = request.content ? JSON.parse(request.content) : false;
        const d = new Date();
        
        this.emit('createMessage', { fromServer, owner, chatId, message: { id, userId, content, timestamp: d.getTime()} });
        
        socket.broadcast.to(chatId).emit('createMessage', { fromServer, chatId, message: { id, userId, content, timestamp: d.getTime()} });
      
      });
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