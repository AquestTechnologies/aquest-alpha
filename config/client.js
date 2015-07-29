import ip from './ip';

export default {
  production: false,
  sessionDuration: 15 * 60 * 1000, // ms
  wsUrl: 'http://'+ ip.localServer + ':' + 9090,
  apiUrl: 'http://'+ ip.localServer + ':' + 8080,
};