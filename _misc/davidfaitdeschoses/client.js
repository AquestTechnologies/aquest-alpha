import Websocket from 'socket.io-client';
const io = Websocket('http://130.211.68.244:8081');

io.on('message', function (message) {
  console.log('___ Server says ' + message);
});