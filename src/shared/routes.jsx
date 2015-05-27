import React        from 'react';
import Router       from 'react-router';  

import App          from './components/App.jsx';
import UniverseHome from './components/UniverseHome.jsx';
import NotFound     from './components/NotFound.jsx';
import Explore      from './components/Explore.jsx';

var Route         = Router.Route;
var DefaultRoute  = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

var routes = (
  <Route path='/' handler={App}>
    <DefaultRoute handler={UniverseHome} />
    <Route name='home' path='/_:universe' handler={UniverseHome} />
    <Route name='explore' path='/Explore' handler={Explore} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

export default routes;