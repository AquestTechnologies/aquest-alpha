import log from '../../../shared/utils/logTailor.js';
import queryDb from '../../queryDb.js';

exports.hello = function () {
  this.emit('Hi back at you');
};

exports.createMessage = function (request) {
  console.log('___ Got message', request);
  
  request.params.messageContent ? request.params.messageContent = JSON.parse(request.params.messageContent) : false;
  
  //test only ;) !
  queryDb(request.intention, request.params).then(
    result => { this.emit('createMessage', result) },
    error => { log(error) }
  );
};

exports.goodbye = function () {
  this.emit('Take it easy, pal');
};