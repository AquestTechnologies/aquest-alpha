import fs     from 'fs';
import Alt    from 'alt';
import Iso    from 'iso';
import Hapi   from 'hapi';
import React  from 'react';
import Router from 'react-router';
import routes from '../shared/routes.jsx';

let port = process.env.PORT || 8080;
let server = new Hapi.Server();

server.connection({
  port: port
});

server.start(function() {
  console.log('Make it rain! Server started at %s', server.info.uri);
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.file('dist/index.html');
  }
});

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
    path: '/{filename}',
    handler: function (request, reply) {
        reply.prerenderer();
    }
});

server.decorate('reply', 'prerenderer', function (elementprops) {
  //on intercepte la réponse
  console.log("Starting prerendering.");
  console.log(this.request.getLog());
  let response = this.response().hold();
  
  function readFile (filename, enc) {
    return new Promise(function (ohyes, ohno){
      fs.readFile(filename, enc, function (err, res){
        if (err) ohno(err);
        else ohyes(res);
      });
    });
  }
  
  //les routes sont partagées et react router prend le relai pour /*
  Router.run(routes, this.request.url.path, function(Handler){
    //Le Router ne prend que des components layout comme route
    //A priori Handler est donc un component layout.
    
    //sérialisation de l'app
    let alt = new Alt();
    let data = {/* fetch data ici */};
    alt.bootstrap(JSON.stringify(data));
    let mount_me_im_famous = React.renderToString(React.createElement(Handler, elementprops));
    
    //le fichier html est partagé
    //penser a le mettre en cache en prod et a prendre une version minifée
    readFile('src/shared/index.html', 'utf8').then(function (html){
      //si le fichier html est chargé on extrait le contenu du mountNode
      let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0];
      //puis on cale notre élément dans le mount node.
      response.source = html.split(placeholder)[0] + mount_me_im_famous + html.split(placeholder)[1];
      response.send();
    });
  });
  return true;//this.response({ status: 'ok' });
});

class ResponseAlt extends Alt {
  constructor(config = {}) {
    super(config);

    //this.addActions('myActions', ActionCreators);
    //this.addStore('storeName', Store);
    
  }
}
//http://alt.js.org/docs/altInstances/
var flux = new ResponseAlt();