import fs        from 'fs';
import React     from 'react';
import JWT       from 'jsonwebtoken';
import ReactDOM  from 'react-dom/server';
import Location  from 'react-router/lib/Location';
import { reduxRouteComponent } from 'redux-react-router';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import Router, { Route } from 'react-router';
import phidippides       from './phidippides';
import reducers          from '../shared/reducers';
import devConfig         from '../../config/development';
import promiseMiddleware from '../shared/utils/promiseMiddleware';
import log, { logAuthentication }  from '../shared/utils/logTailor';
import protectRoutes from '../shared/routes';

const { wds: { hotFile, publicPath, filename }, jwt: { key, ttl } } = devConfig();
const HTML = fs.readFileSync('src/server/index.html', 'utf8');

// Replies a prerendered application
export default function prerender(request, reply) {
  
  const d = new Date();
  const response = reply.response().hold();
  
  const checkCookie = typeof request.state.jwt === 'string' ? // If there is a JWT in the cookie, we verify it
    new Promise((resolve, reject) => JWT.verify(request.state.jwt, key, (err, {userId, expiration}) => {
      if (err) reject(err);
      else {
        const t = new Date().getTime();
        logAuthentication('checkCookie', userId, expiration);
        if (!userId || expiration < t) resolve({}); // If the JWT is expired then the cookie should be inexistent anyway for the cookie and JWT both have the same time to live
        else {
          const session = {userId, expiration: t + ttl};
          response.state('jwt', JWT.sign(session, key), {ttl, path: '/'}); // Adds a renewed cookie to the reponse. Note: somehow, path: '/' is important
          resolve({session});
        }
      }
    })) :
    Promise.resolve({}); // No cookie, no problem

  // First we scan the request for a cookie to renew
  checkCookie.then(reduxState => {
    
    // Then we create a new Redux store and initialize the routes with it
    const html   = HTML;
    const store  = applyMiddleware(promiseMiddleware)(createStore)(combineReducers(reducers), reduxState);
    const routes = <Route children={protectRoutes(store)} component={reduxRouteComponent(store)} />;
    
    // URL processing : /foo/ --> /foo || /foo?bar=baz --> /foo || / --> /
    const requestUrl = request.url.path.split('?')[0];
    const url = requestUrl.slice(-1) === '/' && requestUrl !== '/' ? requestUrl.slice(0, -1) : requestUrl;
    
    Router.run(routes, new Location(url), (err, routerState, transition) => {
      log('... Router.run');
      if (err) {
        log('!!! Error while Router.run', err.message, err.stack); 
        response.statusCode = 500;
        return response.send();
      }
      // If routeGuard canceled a route transition (for example) then we send back a 301 (redirect)
      if (transition.isCancelled) {
        log('... Transition cancelled: redirecting');
        return response.redirect(transition.redirectInfo.pathname + '?r=' + url).send();
      }
      
      // Fetches initial data for components in router's branch
      log('... Entering phidippides');
      const dd = new Date();
      phidippides(routerState, store.dispatch).then(() => {
        
        log(`... Exiting phidippides (${new Date() - dd}ms)`);
        log('... Entering React.renderToString');
        
        // Renders the app (try...catch to be removed in production)
        try {
          var mountMeImFamous = ReactDOM.renderToString(
            <Router {...routerState} children={routes} />
          );
        } 
        catch(err) { log('!!! Error while React.renderToString', err.message, err.stack); }
        log('... Exiting React.renderToString');
        
        // A recoder !
        // On extrait le contenu du mountNode 
        // Il est ici imperatif que le mountNode contienne du texte unique et pas de </div>
        let placeholder = html.split('<div id="mountNode">')[1].split('</div>')[0]; //à mod.
        
        // Passage du state dans window
        const serverState = store.getState();
        delete serverState.records;
        delete serverState.router;
        for (let key in serverState) {
          if (Object.keys(serverState[key]).length === 0) delete serverState[key];
        }
        
        response.source = html
          .replace(placeholder, mountMeImFamous)
          .replace('</body>',
            `\t<script>window.STATE_FROM_SERVER=${JSON.stringify(serverState)}</script>\n` +
            `\t<script src="${hotFile}"></script>\n` +
            `\t<script src="${publicPath + filename}"></script>\n` +
            '</body>' );
        
        response.send(); // Bon voyage
        log(`Served ${url} in ${new Date() - d}ms.\n`);
          
      }, err => log('!!! Error while Phidippides', err.message, err.stack));
    });
  }, err => log('!!! Error while checkCookie', err.message, err.stack));
}
