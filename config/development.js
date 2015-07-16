export default function() {
  
  const main = '130.211.68.244';
  const offset = parseInt(process.env.PORTS_OFFSET, 10) || 0;
  return {
    api: {
      host: main,
      port: 8080 + offset
    },
    ws : {
      host: main,
      port: 9090 + offset
    },
    wds: {
      host: '0.0.0.0',
      port: 3000 + offset,
      filename:   'bundle.js',
      path :__dirname + '/dist',
      publicPath: 'http://' + main + ':' + (3000 + offset) + '/static/',
      hotFile: 'http://' + main + ':' + (3000 + offset) + '/webpack-dev-server.js',
      proxyPathRegex: '^(?!.*\/static\/)(.*)$'
    },
    pg: {  
      host:     '146.148.13.18', 
      port:     '5432', 
      user:     'aquestuser',
      password: 'aquestuser',
      database: 'aquestdb'
    }
  };
}
  
