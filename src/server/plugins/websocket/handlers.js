import log from '../../../shared/utils/logTailor.js';
import queryDb from '../../queryDb.js';

// exports.joinChat = function(request, io) {
//   console.log(`___ ${request.params.userId} joining chat ${request.params.id}`);
//   this.join(request.params.id);
//   io.in(request.params.id).emit('joinChat', request.params);
//   // this.emit('joinChat', request.params);
// };

// exports.leaveChat = function(request, io) {
//   console.log(`___ ${request.params.userId} leaving chat ${request.params.id}`);
//   this.leave(request.params.id);
//   io.in(request.params.id).emit('leaveChat', request.params);
//   // this.emit('leaveChat', request.params);
// };

// exports.createMessage = function(request) {
//   console.log('___ Got message', request.params);
//   request.params.messageContent ? request.params.messageContent = JSON.parse(request.params.messageContent) : false;
  
//   this.in(request.params.id).emit('createMessage', request.params);
//   //test only ;) !
//   // queryDb(request.intention, request.params).then(
//   //   result => { this.emit('createMessage', result) },
//   //   error => { log(error) }
//   // );
// };

exports.createVote = function(request) {
  console.log('___ Got vote', request);
};