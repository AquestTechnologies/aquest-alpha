import Joi        from 'joi';
import SocketIo   from 'socket.io';
import JWT        from 'jsonwebtoken';
import queryDb    from '../../queryDb.js';
import devConfig  from '../../../../config/dev_server';
import log        from '../../../shared/utils/logTailor.js';
import { randomInteger } from '../../../shared/utils/randomGenerators';
import { WEBSOCKET_VALIDATION_SCHEMA as validationSchema } from '../../validationSchema.js';

// Le plugin Websocket pour Hapi
export default function websocketPlugin(server, options, next) {
  const { key, ttl } = devConfig.jwt;
  
  // creates websocket server using 'ws' defined port
  const io = new SocketIo(server.select('ws').listener);
  
  const chatNamespace = io.of('/chat');
  chatNamespace.use(socketAuthentication);
  
  let chatsUsers = 0;
  const UserLists = {};
  
  chatNamespace.on('connection', socket => {
    chatsUsers++;
    
    socket.on('joinChat', request => {
      Joi.validate(request, validationSchema['joinChat'], (err, value) => {
        if (err) return log(err);
        
        const chatId = request;
        const { userId } = socket;
        
        socket.join(chatId);
        if (!UserLists[chatId]) UserLists[chatId] = [];
        
        let userList = UserLists[chatId];
        userList.push(userId);
        
        log(`_w_ ${userId} joining chat ${chatId} - ${userList.length}/${chatsUsers}`);
        
        // Sends the current list of people in the chat to the user joining the chat
        socket.emit('receiveJoinChatOwner', { chatId, userList });
        
        // Sends the user info to current people in the chat
        socket.broadcast.to(chatId).emit('receiveJoinChat', { chatId, userId });
      });
    });
  
    socket.on('leaveChat', request => {
      Joi.validate(request, validationSchema['leaveChat'], (err, value) => {
        if (err) return log(err);
        
        const chatId = request;
        const { userId } = socket;
        
        socket.leave(chatId);
        
        if (!UserLists[chatId]) UserLists[chatId] = [];
        
        let userList = UserLists[chatId];
        userList.splice(userList.indexOf(userId), 1);
        
        log(`_w_ ${userId} leaving chat ${chatId} - ${userList.length}/${chatsUsers}`);
        
        // Sends a request to remove the user who left the chat from their list
        socket.broadcast.to(chatId).emit('receiveLeaveChat', { chatId, userId });
      });
    });
    
    socket.on('createMessage', request => {
      Joi.validate(request, validationSchema['createMessage'], (err, value) => {
        if (err) return log(err);
        
        const { chatId, message: {content} } = request;
        const lcId = request.message.id; // the user provide a temporary id
        
        userAuthentication(socket).then(
          result => {
            log('authentication succeded', result);
            
            const { userId } = socket;
            const d = new Date(); // let's fix that later
            const id = randomInteger(0, 1000000); // it's supposed to be the real id
            
            queryDb('createMessage', {chatId, userId, content}).then(
              result => {
                
                const {id, chatId, type, content, createdAt} = result;
                
                log(`_w_ createMessage`, { chatId, lcId, message: { id, userId, content, createdAt}});
            
                socket.emit('receiveMessageOwner', { chatId, lcId, message: { id, userId, content, createdAt}});
                socket.broadcast.to(chatId).emit('receiveMessage', { chatId, message: { id, userId, content, createdAt}});
              },
              error => {
                log(`_w_ createMessage error`, error);
                socket.error('An error occured, sorry for the inconvenience, please bear with us and retry :) !');
              }
            );
          },
          error => {
            log('websocket authentication - ', error.stack ? error.stack : error);
            
            const id = 'feelFreeToSignUp-'+randomInteger(0, 1000000);
            const d = new Date(); // let's fix that later
            
            socket.error('To send messages please sign in !');
            socket.error( {chatId, lcId, message: {id, userId: 'aquest', content: {type: 'text', text:'To send messages please sign in !'}, createdAt: d.getTime()}} );
          }
        );
      });
    });
    
    socket.on('disconnect', request => {
      chatsUsers--;
      let disconnectChatId = -1;
      
      const { userId, id } = socket;
      log(`_w_ [${chatsUsers}] ${userId} id: ${id} disconnected`);
      
      //dirty wait for RabbitMQ
      for (let chatId in UserLists) {
        UserLists[chatId] = UserLists[chatId].filter(user => {
          if (user === userId) {
            disconnectChatId = chatId;
            // log(`from a chatId: ${disconnectChatId} - universe | topic`);
            socket.broadcast.to(chatId).emit('leaveChat', { chatId, userId });
            return false;
          }
          return true;
        });
      }
    });
  });
  
  const voteNamespace= io.of('/vote');
  voteNamespace.use(socketAuthentication);
  
  let voteUsers = 0;
  voteNamespace.on('connection', socket => {
      voteUsers++;
      
      socket.on('joinVote', request => Joi.validate(request, validationSchema['joinVote'], (err, value) => {
        if (err) return log(err);
        socket.join(request);
      }));
    
      socket.on('disable', request => Joi.validate(request, validationSchema['leaveVote'], (err, value) => {
        if (err) return log(err);
        socket.leave(request);
      }));      
      
      socket.on('createVoteMessage', request => {
        console.log('createVoteMessage', request);
        Joi.validate(request, validationSchema['createVoteMessage'], (err, value) => {
          if (err) return log(err);
          
          userAuthentication(socket).then(
            result => {
              log('authentication succeded', result);
              const { userId } = socket;
              
              const { ballotId, voteTargetContext: {chatId, voteContextId, messageIndex, messageId} } = request;
              const voteContext = voteContextId.split('-')[0];
              
              console.log({voteContext, userId, voteTargetId: messageId, ballotId});
              queryDb('createVoteMessage', {voteContext, userId, voteTargetId: messageId, ballotId}).then(
                result => {
                  
                  const {userId, ballotId, messageId, createdAt, deleted} = result;
                  
                  log(`_w_ createVoteMessage`, { ballotId, chatId, messageId, vote: {userId, createdAt}, deleted });
              
                  socket.emit('receiveVoteMessageOwner', { ballotId, chatId, messageIndex, vote: {userId, createdAt}, deleted } );
                  
                  socket.broadcast.to(voteContextId).emit('receiveVoteMessage', { ballotId, chatId, messageId, vote: {userId, createdAt}, deleted });
                },
                error => {
                  log(`_w_ createMessage error`, error);
                  socket.error('An error occured, sorry for the inconvenience, please bear with us and retry :) !');
                }
              );
              
            },
            error => {
              log('websocket authentication - ', error.stack ? error.stack : error);
              
              socket.error('To vote on a message please sign in !');
            }
          );
        });
      });
      
      socket.on('createVoteTopic', request => {
        console.log('createVoteTopic', request);
        Joi.validate(request, validationSchema['createVoteTopic'], (err, value) => {
          if (err) return log(err);
          
          userAuthentication(socket).then(
            result => {
              log('authentication succeded', result);
              
              const { userId } = socket;
              const { ballotId, voteTargetContext: {topicId, voteContextId} } = request;

              console.log({voteContextId, userId, voteTargetId: topicId, ballotId});
              queryDb('createVoteTopic', {userId, voteTargetId: topicId, ballotId}).then(
                result => {
                  
                  const {userId, ballotId, topicId, createdAt, deleted} = result;
                  
                  log(`_w_ createVoteTopic`, { ballotId, topicId, vote: {userId, createdAt}, deleted });
              
                  socket.emit('receiveVoteTopicOwner', { ballotId, topicId, vote: {userId, createdAt}, deleted } );
                  
                  socket.broadcast.to(voteContextId).emit('receiveVoteTopic', { ballotId, topicId, vote: {userId, createdAt}, deleted });
                },
                error => {
                  log(`_w_ createMessage error`, error);
                  socket.error('An error occured, sorry for the inconvenience, please bear with us and retry :) !');
                }
              );
            },
            error => {
              log('websocket authentication - ', error.stack ? error.stack : error);
              
              socket.error('To vote on a topic please sign in !');
            }
          );
        });
      });
      
      socket.on('disconnect', (socket) => {
        voteUsers--;
        log('_w_ [' + voteUsers + '] A client disconnected from voting for a topic | message');
      });
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
      
      var key = pair.substr(0, eq_idx).trim();
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
  
  function userAuthentication(socket) { 
    
    // console.log('_w_ userAuthentication cookie validation', socket.request.headers.cookie);
    return !socket.request.headers.cookie ?
      Promise.reject('not authorized ! sign in ?') :
      new Promise((resolve, reject) => {
        const cookie = parseCookie(socket.request.headers.cookie);
        
        if (cookie.jwt) JWT.verify(cookie.jwt, key, (err, {userId, expiration}) => {
          if (err) return reject(err);
          
          if (expiration > new Date().getTime()) resolve(userId);
          else reject('not authorized ! sign in ?');
        });
        else reject('no jwt cookie object');
      });
  } 
  
  function socketAuthentication(socket, next) { 
    // console.log('_w_ socketAuthentication cookie validation', socket.request.headers.cookie);
    const strCookie = socket.request.headers.cookie;
    const cookie = strCookie ? parseCookie(strCookie) : {};
    
    if (cookie.jwt) JWT.verify(cookie.jwt, key, (err, {userId, expiration}) => { 
      if (err) return next(new Error('Authentication error'));
      socket.userId = userId;
      next();
    });
    else {
      socket.userId = socket.id;
      next();
    }
  }
  
  next();
}

websocketPlugin.attributes = {
  name: 'websocketPlugin'
};
