import ip from './ip';

export default {
  production: false,
  wsUrl: 'http://'+ ip.localServer + ':' + 9090,
  apiUrl: 'http://'+ ip.localServer + ':' + 8080,
};