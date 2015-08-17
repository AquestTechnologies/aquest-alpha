import Hapi from 'hapi';
import prerender from './prerender';
import devConfig from '../../config/development.js';
import log, { logRequest, logAuthentication } from '../shared/utils/logTailor.js';
import { createActivists } from './activityGenerator';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
log(`\nStarting server in ${process.env.NODE_ENV} mode...`);

//lance webpack-dev-server si on est pas en production
if (process.env.NODE_ENV === 'development') require('./dev_server/dev_server')();

const server = new Hapi.Server();
const {api, ws, jwt: {key}} = devConfig();

function validateJWT({userId, expiration}, request, callback) {
  logAuthentication('validateJWT', userId, expiration);
  callback(null, expiration > new Date().getTime()); // returns 'false' if expired
}

// Distribution des ports pour l'API et les websockets
server.connection({ port: api.port, labels: ['api'] });
server.connection({ port: ws.port,  labels: ['ws']  });

// Auth strategy registration
server.register(require('hapi-auth-jwt2'), err => {
  if (err) throw err;
  
  server.auth.strategy('jwt', 'jwt', true, {
    key,      
    cookieKey: 'jwt',
    validateFunc: validateJWT,         
    verifyOptions: { algorithms: ['HS256'] }
  });
  
  log('JWT Authentication registered');
});
  
// API and WS plugin registration
server.register([{register: require('./plugins/API')}, {register: require('./plugins/websocket')}], err => {
  if (err) throw err;
  log('API and WS plugins registered');
  
  // Routes
  server.route([
    {
      method: 'GET',
      path: '/',
      config: { auth: false },
      handler: (request, reply) => prerender(request, reply)
    },
    {
      method: 'GET',
      path: '/{p*}',
      config: { auth: false },
      handler: (request, reply) => prerender(request, reply)
    },
    {
      method: 'GET',
      path: '/img/{filename}',
      config: { auth: false },
      handler: (request, reply) => reply.file('dist/img/' + request.params.filename)
    }
  ]);
});

server.ext('onRequest', (request, reply) => {
  logRequest(request);
  return reply.continue();
});

// Démarrage du server
server.start(() => {
  log(`Make it rain! API server started at ${server.info.uri}`);
  log(`              ws  server started at ${server.select('ws').info.uri}`);
  console.log(
    '  ___                        _        \n' + // !
    ' / _ \\                      | |      \n' +
    '/ /_\\ \\ __ _ _   _  ___  ___| |_    \n' +
    '|  _  |/ _` | | | |/ _ \\/ __| __|    \n' +
    '| | | | (_| | |_| |  __/\\__ \\ |_    \n' +
    '\\_| |_/\\__, |\\__,_|\\___||___/\\__|\n' +
    '          | |\n' +
    '          |_|'
  );
  if (1) console.log(...server.table()[0].table.map(t => `\n${t.method} - ${t.path}`));
  if (0) {
    const {startActivists, stopActivists} = createActivists(4, 1000, 10000);
    startActivists();
  }
});
