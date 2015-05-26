import React from 'react';
import Router from 'react-router';  
var Route         = Router.Route;
var DefaultRoute  = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;


import App from './components/App.jsx';
import Layout from './components/Layout.jsx';
import NotFound from './components/NotFound.jsx';

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Layout} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

export default routes;