import fs     from 'fs';
import Hapi   from 'hapi';
import React  from 'react';
import Router from 'react-router';
import routes from '../shared/routes.jsx';
import Flux from '../shared/flux.js';
import FluxComponent from 'flummox/component';
import performRouteHandlerStaticMethod from '../shared/utils/performRouteHandlerStaticMethod.js';
import winston from 'winston';
import pg from 'pg';

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'info-file',
      filename: '/home/dherault_gmail_com/yolo/aquest-alpha/src/logs/info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: '/home/dherault_gmail_com/yolo/aquest-alpha/src/logs/error.log',
      level: 'error'
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
  path: '/api/universe/{id}',
  handler: function (request, reply) {
    logger.info('request params : ' + request.params.universeName);
    var universeName = request.params.universeName;
    // il faudra créer une classe qui vérifie les users inputs de l'utilisateur
    if (typeof universeName === 'string'){
      client.connect(function(err) {
        if(err) {
          return logger.info('could not connect to postgres', err);
        }
        let queryUniverse = 'SELECT * FROM aquest_schema.universe WHERE name = \'' + universeName + '\'';
  
        client.query(queryUniverse, function(err, result) {
          if(err) {
            return logger.info('error running query', err);
          }
          logger.info(result.rows[0].description);
          client.end();
        });
      });
    } else {
      logger.info('is not a string');
    }
  }
});


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

    // Initialise le router
    const router = Router.create({
      routes: routes,
      location: url.path
    });
    
    // Match la location et les routes, et renvoie le bon layout (Handler) et le state
    router.run( async (Handler, routerState) => {
      logger.info('_____________ router.run _____________');
      // Pour l'application naissante c'est son premier router.run
      routerState.c = 1;
      // Initialise une nouvelle instance flux
      const flux = new Flux();
      
      // Initialise les stores
      await performRouteHandlerStaticMethod(routerState.routes, 'populateFluxState', { flux, routerState } );
      logger.info('... Exiting performRouteHandlerStaticMethod');
      
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
        logger.info('Served '+ url.path + '\n');
      }).catch(function (err) {
        logger.error('!!! Error while reading HTML.');
        logger.error(err);
      });
      
    });
  });
})();
