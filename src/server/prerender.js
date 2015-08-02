import fs        from 'fs';
import React     from 'react';
import Immutable from 'immutable';
import JWT       from 'jsonwebtoken';
import ReactDOM  from 'react-dom/server';
import Location  from 'react-router/lib/Location';
import Router, { Route } from 'react-router';
import { reduxRouteComponent } from 'redux-react-router';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import reducers          from '../shared/reducers';
import devConfig         from '../../config/development.js';
import phidippides       from '../shared/utils/phidippides.js';
import promiseMiddleware from '../shared/utils/promiseMiddleware.js';
import log, { logAuthentication }  from '../shared/utils/logTailor.js';
import makeJourney, { routeGuard } from '../shared/routes.jsx';


const {wds: {hotFile, publicPath, filename}, jwt: {key, ttl}} = devConfig();
const HTML = fs.readFileSync('index.html', 'utf8');

// Checks for authentication and performs optionnal cookie mutation
// Returns a promise resolving Redux's initial state with session info
const checkCookie = ({state: {jwt}}, response) => jwt ?

  // If there is a JWT in the cookie, we decode and verify it
  new Promise((resolve, reject) => JWT.verify(jwt, key, (err, {userId, expiration}) => {
    if (err) reject(err);
    else {
      const t = new Date().getTime();
      logAuthentication('... checkCookie', userId, expiration);
      if (!userId || expiration < t) resolve({}); // If timeLeft < 0 then the cookie should be inexistent anyway for the cookie and JWT both have the same time to live
      else {
        const session = {userId, expiration: t + ttl};
        response.state('jwt', JWT.sign(session, key), {ttl}); // adds a renewed cookie to the reponse
        resolve({session});
      }
    }
  })) :
  Promise.resolve({});

// Replies a prerendered application
export default function prerender(request, reply) {
  
  const d = new Date();
  const response = reply.response().hold();
  
  checkCookie(request, response).then(reduxInitialState => {
    
    const html   = HTML;
    const store  = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), reduxInitialState);
    const safe   = routeGuard(store);
    const routes = <Route component={reduxRouteComponent(store)} children={makeJourney(safe)} />;
    
    // transforme coco.com/truc/ en coco.com/truc
    const requestUrl = request.url.path.split('?')[0];
    const url = requestUrl.slice(-1) === '/' && requestUrl !== '/' ? requestUrl.slice(0, -1) : requestUrl;
    
    Router.run(routes, new Location(url), (err, initialState, transition) => {
      log('... Router.run');
      if (err) log('!!! Error while Router.run', err);  
      
      // log('initialState', initialState);
      if (transition.isCancelled) {
        log('... Transition cancelled: redirecting');
        response.redirect(transition.redirectInfo.pathname + '?r=' + url).send();
        return;
      }
      
      log('... Entering phidippides');
      const dd = new Date();
      phidippides(initialState, store.dispatch).then(() => {
        
        log(`... Exiting phidippides (${new Date() - dd}ms)`);
        log('... Entering React.renderToString');
        try {
          var mountMeImFamous = ReactDOM.renderToString(
            <Router {...initialState} children={routes} />
          );
        } 
        catch(err) { log('!!! Error while React.renderToString', err, err.stack); }
        log('... Exiting React.renderToString');
        
        // On extrait le contenu du mountNode 
        // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
        let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0]; //à mod.
        
        // Passage du state dans window
        const serverState = store.getState();
        delete serverState.records;
        serverState.immutableKeys = [];
        for (let key in serverState) {
          if (Immutable.Map.isMap(serverState[key])) serverState.immutableKeys.push(key); //Mutation !
        }
        
        response.source = html
          .replace(placeholder, mountMeImFamous)
          .replace('</body>',
            `\t<script>window.STATE_FROM_SERVER=${JSON.stringify(serverState)}</script>\n` +
            `\t<script src="${hotFile}"></script>\n` +
            `\t<script src="${publicPath + filename}"></script>\n` +
            '</body>' );
        
        response.send();
        log(`Served ${url} in ${new Date() - d}ms.\n`);
          
      }, err => log('!!! Error while Phidippides', err));
    });
  }, err => log('!!! Error while JWT.verify', err));
}