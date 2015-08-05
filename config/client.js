import ip from './ip';

export default {
  production: false,
  sessionDuration: 60 * 60 * 1000, //60 minutes
  wsUrl: 'http://'+ ip.localServer + ':' + 9090,
  apiUrl: 'http://'+ ip.localServer + ':' + 8080,
};