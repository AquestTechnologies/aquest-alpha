import Hapi from 'hapi';
import inert from 'inert';
import prerender from './prerender';
import devConfig from '../../config/dev_server';
import APIPlugin from './plugins/API';
import uploadsPlugin from './plugins/uploads';
import websocketPlugin from './plugins/websocket';
import { createActivists } from './activityGenerator';
import log, { logRequest, logAuthentication } from '../shared/utils/logTailor';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
log(`\nStarting server in ${process.env.NODE_ENV} mode...`);

//lance webpack-dev-server si on est pas en production
if (process.env.NODE_ENV === 'development') require('./development/devServer')();

const server = new Hapi.Server();
const {api, ws, jwt: {key}} = devConfig;

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
server.register([
  { register: inert },
  { register: APIPlugin }, 
  { register: uploadsPlugin },
  { register: websocketPlugin },
], err => {
  if (err) throw err;
  log('API and WS plugins registered');
  
  // Routes
  server.route([
    {
      method: 'GET',
      path: '/{p*}',
      config: { auth: false },
      handler: prerender,
    },
    {
      method: 'GET',
      path: '/img/{filename}',
      config: { auth: false },
      handler: (request, reply) => reply.file('public/img/' + request.params.filename),
    },
  ]);
});

server.ext('onRequest', (request, reply) => {
  logRequest(request);
  reply.continue();
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
  if (0) log(...server.table()[0].table.map(t => `\n${t.method} - ${t.path}`));
  if (1) {
    const {startActivists, stopActivists} = createActivists(10, 1000, 10000);
    startActivists();
  }
});
