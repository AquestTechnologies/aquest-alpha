import ip from './ip';

export default function() {
  const main = ip.localServer;
  const wdsPost = 3000;
  
  return {
    api: {
      host: main,
      port: 8080
    },
    ws : {
      host: main,
      port: 9090
    },
    wds: {
      host:           '0.0.0.0',
      port:           wdsPost,
      filename:       'bundle.js',
      path:           __dirname + '/dist',
      publicPath:     'http://' + main + ':' + wdsPost + '/static/',
      hotFile:        'http://' + main + ':' + wdsPost + '/webpack-dev-server.js',
      proxyPathRegex: '^(?!.*\/static\/)(.*)$'
    },
    pg: {  
      host:     '130.211.111.160', 
      port:     '5432', 
      user:     'aquestuser',
      password: 'aquestuser',
      database: 'aquestdb'
    },
    jwt: {
      key: 'ohPleaseHackMe',
      ttl: 1 * 60 * 1000
    }
  };
}
  
