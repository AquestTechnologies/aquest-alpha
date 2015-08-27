import Handlers   from './handlers';
import JWT        from 'jsonwebtoken';
import log        from '../../../shared/utils/logTailor.js';
import devConfig  from '../../../../config/development.js';
import Joi        from 'joi';
import SocketIo   from 'socket.io';
import {WEBSOCKET_VALIDATION_SCHEMA as validationSchema} from '../../validationSchema.js';
import {randomInteger} from '../../../shared/utils/randomGenerators';

// Le plugin Websocket pour Hapi
exports.register = function (server, options, next) {
  const {key, ttl} = devConfig().jwt;
    
  // creates websocket server using 'ws' defined port
  const io = new SocketIo(server.select('ws').listener);
  
  //before RabbitMQ implementation
  // let userList = new WeakMap(); --> Doesn't work at the moment
  let chatList = {};
  const owner = true;
  
  //namespace for the chat of a universe or a topic
  const chat = io.of('/chat-universe-topic');
  chat.use(socketAuthentication);
  
  let chatUsers = 0;
  chat.on('connection', (socket) => {
    chatUsers++;
    log('___ [' + chatUsers + '] New client connected in a chat universe | topic');
    
    socket.on('joinChat', function(request) {
      Joi.validate(request, validationSchema['joinChat'], (err, value) => {
        if (err) throw err;
          
        const chatId = request;
        const {userId} = socket;
        
        this.join(chatId);
        // userList.set({userId: request.userId}, request);
        let userList = Array.isArray(chatList[chatId]) ? chatList[chatId] : chatList[chatId] = [];
        userList.push(userId);

        log(`___ ${userId} joining chat ${chatId} - countUsers: ${chatList[chatId].length}`);
        
        // send the current list of people in the chat to the user joining the chat
        this.emit('receiveJoinChat', { chatId, userList, owner });
        
        //send the user info to current people in the chat
        socket.broadcast.to(chatId).emit('receiveJoinChat', { chatId, userId });
      });
    });

    socket.on('leaveChat', function(request) {
      Joi.validate(request, validationSchema['leaveChat'], (err, value) => {
        
        if (err) throw err;
        
        const chatId = request;
        const {userId} = socket;
        
        this.leave(chatId);
        // userList.delete(socket);
        let userList = Array.isArray(chatList[chatId]) ? chatList[chatId] : chatList[chatId] = [];
        userList.splice(userList.indexOf(userId), 1);
        
        log(`___ ${userId} leaving chat ${chatId} - countUsers: ${chatList[chatId].length}`);
        
        //send request to remove the user who left the chat from their list
        socket.broadcast.to(chatId).emit('receiveLeaveChat', { chatId, userId });
      });
    });
    
    socket.on('createMessage', function(request) {
      Joi.validate(request, validationSchema['createMessage'], (err, value) => {
        
        if (err) throw err;
        
        const {chatId, content} = request;
        const lcId = request.id; // the user provide a temporary id
        
        userAuthentication(socket).then(
          result => {
            log('authentication succeded', result);
            
            const {userId} = socket;
            const d = new Date(); // let's fix that later
            const id = randomInteger(0, 1000000); // it's supposed to be the real id
            
            log(`___ ${userId} createMessage`, { chatId, message: { id, lcId, userId, content, createdAt: d.getTime()}});
            
            socket.emit('receiveMessage', { chatId, message: { id, lcId, userId, content, createdAt: d.getTime()}, owner});
            
            socket.broadcast.to(chatId).emit('receiveMessage', { chatId, message: { id, userId, content, createdAt: d.getTime()} });
          },
          error => {
            log('websocket authentication - ', error.stack ? error.stack : error);
            
            const id = 'feelFreeToSignUp-'+randomInteger(0, 1000000);
            const d = new Date(); // let's fix that later
            
            socket.error('To send messages please sign in !');
            socket.error( {chatId, message: {id, lcId, userId: 'aquest', content: {type: 'text', text:'To send messages please sign in !'}, createdAt: d.getTime()}, owner} );
          }
        );
      });
    });
    
    socket.on('disconnect', (request) => {
      chatUsers--;
      let disconnectChatId = -1;
      
      log(`___ [${chatUsers}] ${socket.userId} id: ${socket.id}`);
      
      //dirty wait for RabbitMQ
      const {userId} = socket;
      for(let chatId in chatList) {
        chatList[chatId] = chatList[chatId].filter((user) => {
          if(user === userId){
            disconnectChatId = chatId;
            log(`disconnected from a chatId: ${disconnectChatId} - universe | topic`);
            socket.broadcast.to(chatId).emit('leaveChat', { chatId, userId });
            return false;
          }
          return true;
        });
      }
    });
  });
  
  /**
   * Should we really use socketio to vote ?
   * namespace to vote for a topic/message
   * */
  const vote = io.of('/vote');
  let voteUsers = 0;
  vote.on('connection', (socket) => {
      voteUsers++;
      log('___ [' + voteUsers + '] New client is able to vote for a topic | message');
      
      socket.on('createVote', Handlers.createVote);
      
      socket.on('disconnect', (socket) => {
        voteUsers--;
        log('___ [' + voteUsers + '] A client disconnected from voting for a topic | message');
      })
  });
  
  //Simplified version of cookie parsing from https://github.com/jshttp/cookie/blob/master/index.js
  function parseCookie(str){
    if (typeof str !== 'string') {
      throw new TypeError('parseCookie argument str must be a string');
    }
  
    let obj = {};
    const pairs = str.split(/; /g);
  
    pairs.forEach(function(pair) {
      let eq_idx = pair.indexOf('=');
  
      // skip things that don't look like key=value
      if (eq_idx < 0) {
        return;
      }
  
      var key = pair.substr(0, eq_idx).trim()
      var val = pair.substr(++eq_idx, pair.length).trim();
  
      // quoted values
      if ('"' == val[0]) {
        val = val.slice(1, -1);
      }
  
      // only assign once
      if (undefined == obj[key]) {
        obj[key] = val;
      }
    });
  
    return obj;
  }
  
  function setJWTCookie(jwt, cookie){
    let strCookie;
    
    for(let key in cookie){
      if(key === 'jwt') strCookie += `${key}=${jwt}; `;
      else {
        strCookie += `${key}=${cookie[key]}; `;
      }
    }
    
    return strCookie;
  }
  
  function userAuthentication(socket) { 
    
    console.log('.W. userAuthentication cookie validation', socket.request.headers.cookie);
    if (socket.request.headers.cookie) {
      let strCookie = socket.request.headers.cookie;
      const cookie = parseCookie(strCookie);
        
      return new Promise((resolve, reject) => {
        if (cookie.jwt) {
          JWT.verify(cookie.jwt, key, (err, {userId, expiration}) => { // JWT.decode() should be enough since the token has already been verified by Hapi-Auth-JWT2
            const t = new Date().getTime();
            if (err) return reject(err);
            // else if (expiration > t) {
            //   strCookie = setJWTCookie( cookie, JWT.sign({userId, expiration: t + ttl}, key) );
            //   log('... WebSocket : token renewed');
            // }
            resolve(userId);
          });
        } else {
          reject('no jwt cookie object');
        }
      });
    } else {
      log('websocket authentication - no cookie');
      socket.error('not authorized ! sign in ?');
    }
  }
  
  function socketAuthentication(socket, next) { 
    console.log('.W. socketAuthentication cookie validation', socket.request.headers.cookie);
    let strCookie = socket.request.headers.cookie;
    const cookie = strCookie ? parseCookie(strCookie) : false;
      
    let authPromise = new Promise((resolve, reject) => {
      if (cookie && cookie.jwt) {
        JWT.verify(cookie.jwt, key, (err, {userId, expiration}) => { // JWT.decode() should be enough since the token has already been verified by Hapi-Auth-JWT2
          const t = new Date().getTime();
          if (err) return reject(err);
          else if (expiration > t) {
            strCookie = setJWTCookie( cookie, JWT.sign({userId, expiration: t + ttl}, key) );
            log('... WebSocket : token renewed');
          }
          resolve(userId);
        });
      } else {
        resolve(socket.id);
      }
    });
    
    authPromise.then(
      result => {
        log('retrieved or generate userId succeded', result);
        socket.userId = result; // keep userId in the socket object of the user
        return next();
      },
      error => {
        log('retrieved or generate userId Failed : ', error.stack ? error.stack : error);
      }
    );
  }
  
  next();
};

exports.register.attributes = {
  name: 'hapi-ws'
};