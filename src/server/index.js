import fs     from 'fs';
import Hapi   from 'hapi';
import React  from 'react';
import Router from 'react-router';
import routes from '../shared/routes.jsx';
import Flux from '../shared/flux.js';
import FluxComponent from 'flummox/component';
import phidippides from '../shared/utils/phidippides.js';
import winston from 'winston';
import pg from 'pg';

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      showLevel: false
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: '/home/dherault_gmail_com/aquest-alpha/log/info.log',
      level: 'info',
      showLevel: false
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: '/home/dherault_gmail_com/aquest-alpha/log/error.log',
      level: 'error',
      showLevel: false
    })
  ]
});

const bdUser = 'aquestuser';
const bdPassword = 'aquestuser';
const bdIp = '146.148.13.18'; 
const bdPort = '5432'; 
const bdName = 'aquestdb';
const postgresurl = 'postgres://'+bdUser+':'+bdPassword+'@'+bdIp+':'+bdPort+'/'+bdName;

let client = new pg.Client(postgresurl);

let server = new Hapi.Server();
// Distribution des ports pour l'API et les websockets
let portApi = process.env.PORT || 8080;
let portWs = process.env.PORT ? Number(portApi) + 1 : 8081;
server.connection({ port: portApi, labels: ['api'] });
server.connection({ port: portWs, labels: ['ws'] });

// Registration du plugin websocket
server.register(require('./websocket'), function (err) {
  if (err) { throw err; }
  // Si le server websocket est bien démarré, on lance le serveur API
  server.start(function() {
    logger.info('Make it rain! API server started at ' + server.info.uri);
    logger.info('              ws  server started at ' + server.select('ws').info.uri);
    console.log('  ___                        _        \n' + // !
                ' / _ \\                      | |      \n' +
                '/ /_\\ \\ __ _ _   _  ___  ___| |_    \n' +
                "|  _  |/ _` | | | |/ _ \\/ __| __|    \n" +
                '| | | | (_| | |_| |  __/\\__ \\ |_    \n' +
                '\\_| |_/\\__, |\\__,_|\\___||___/\\__|\n' +
                '          | |\n' +
                '          |_|'
               );
  
  });
});

//Routage des assets, inutile en production car derriere un CDN
server.route({
  method: 'GET',
  path: '/app.js',
  handler: function (request, reply) {
    reply.file('dist/app.js');
  }
});

server.route({
  method: 'GET',
  path: '/app.css',
  handler: function (request, reply) {
    reply.file('dist/app.css');
  }
});

server.route({
    method: 'GET',
    path: '/img/{filename}',
    handler: function (request, reply) {
        reply.file('dist/img/' + request.params.filename);
    }
});


server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.prerenderer(request.url, request.info.remoteAddress, request.info.remotePort, request.method);
  }
});

server.route({
  method: 'GET',
  path: '/{p*}',
  handler: function (request, reply) {
    reply.prerenderer(request.url, request.info.remoteAddress, request.info.remotePort, request.method);
  }
});

server.route({
  method: 'GET',
  path: '/favicon.ico',
  handler: function (request, reply) {
    return reply({});
  }
});

/*server.register({register: require('./plugin/restAPI')}, {
    select: ['api'],
    routes: {
        prefix: '/api'
    }
}, function (err) {
  logger.error('Plugin register error', err)
});*/

/*server.route({
  method: 'GET',
  path: '/api/universe/{universeId}',
  handler: function (request, reply) {
    logger.info('request params : ' + request.params.universeId);
    let universeId = request.params.universeId;
    // il faudra créer une classe qui vérifie les users inputs de l'utilisateur
    if (typeof universeId === 'string'){
      client.connect(function(err) {
        if(err) {
          return logger.info('could not connect to postgres', err);
        }
        let queryUniverse = 'SELECT universeId, name, description, chatId FROM aquest_schema.universe WHERE universeId=\'' + universeId + '\'';
  
        client.query(queryUniverse, function(err, result) {
          if(err) {
            return logger.info('error running query', err);
          }
          
          logger.info('universe : '+ result.rows[0]);
          
          if(result.rows[0] !== undefined){
          
            let universeData = {
              id:          result.rows[0].universeId,
              name:        result.rows[0].name,
              description: result.rows[0].description,
              chatId:      result.rows[0].chatId,
            };
            
            logger.info('universe : '+ JSON.stringify(universeData));
            //client.end();
          
            return reply(universeData);
          } else {
            return reply('No universe');
          }
        });
      });
    } else {
      logger.info('is not a string');
    }
  }
});*/


// Prerendering
(function() {
  let c = 0;
  
  server.decorate('reply', 'prerenderer', function (url, ip, port, method) {
    
    // Intercepte la réponse
    let response = this.response().hold();
    
    // Affiche les infos de la requete
    let d = new Date(),
        h = d.getHours() + 2, //heure française / GTM
        m = d.getMinutes(),
        s = d.getSeconds();
    h = ('' + h).length == 2 ? h : '0' + h;
    m = ('' + m).length == 2 ? m : '0' + m;
    s = ('' + s).length == 2 ? s : '0' + s;
    c++;
    logger.info('\n[' + c + '] ' + h + ':' + m + ':' + s + ' ' + this.request.info.remoteAddress + ':' + this.request.info.remotePort + ' ' + this.request.method + ' ' + this.request.url.path);
    
    // Servira à lire le fichier HTML
    function readFile (filename, enc) {
      return new Promise(function (ohyes, ohno){
        fs.readFile(filename, enc, function (err, res){
          if (err) ohno(err);
          else ohyes(res);
        });
      });
    }
    
    // transforme coco.com/truc/ en coco.com/truc
    let correctUrl = url.path.slice(-1) === '/' ? url.path.slice(0, -1) : url.path;
    // Initialise le router
    const router = Router.create({
      routes: routes,
      location: correctUrl
    });
    
    // Match la location et les routes, et renvoie le bon layout (Handler) et le state
    router.run( (Handler, routerState) => {
      logger.info('_____________ router.run _____________');
      // Pour l'application naissante c'est son premier router.run
      routerState.c = 1;
      // Initialise une nouvelle instance flux
      const flux = new Flux();
      
      // Initialise les stores
      logger.info('... Entering phidippides');
      phidippides(routerState, flux).then(function() {
        logger.info('... Exiting phidippides');
        // logger.info(Handler);
        // logger.info('state_________________________________________________');
        // logger.info(state);
        // logger.info('flux_________________________________________________');
        // logger.info(flux);
        // logger.info('_________________________________________________');
        // logger.info(flux._stores.universeStore.state);
        
        // On extrait le state de l'instance flux
        let fluxState = {};
        for (let store in flux._stores) { 
          fluxState[store] = flux._stores[store].state;
        }
        let serializedState = JSON.stringify(fluxState);
        // On escape le charactere ' du state serialisé
        serializedState = serializedState.replace(/'/g, '&apos;');
        logger.info('... Flux state serialized');
        // logger.info(serializedState);
        
        // rendering de l'app fluxée
        // Doc React pour info : If you call React.render() on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
        logger.info('... Entering React.renderToString');
        try {
          var mount_me_im_famous = React.renderToString(
            <FluxComponent flux={flux}>
              <Handler {...routerState} />
            </FluxComponent>
          );
        } catch(err) {
          logger.error('!!! Error while React.renderToString.');
          logger.error(err);
        }
        logger.info('... Exiting React.renderToString');
        
        // Le fichier html est partagé, penser a prendre une version minifée en cache en prod
        readFile('src/shared/index.html', 'utf8').then(function (html){
          
          // On extrait le contenu du mountNode 
          // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
          let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
          // Enfin on cale notre élément dans le mountNode.
          let htmlWithoutFlux = html.replace(placeholder, mount_me_im_famous);
          let htmlWithFlux = htmlWithoutFlux.replace('id="mountNode"', 'id="mountNode" state-from-server=\'' + serializedState + '\'');
          response.source  = htmlWithFlux;
          response.send();
          logger.info('Served '+ correctUrl + '\n');
        }).catch(function (err) {
          logger.error('!!! Error while reading HTML.');
          logger.error(err);
        });
      }).catch(function(err) {
        logger.error('!!! Error while Phidippides.');
        logger.error(err);
      });
    });
  });
})();
