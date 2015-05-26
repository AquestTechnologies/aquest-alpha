import React from 'react';
import App from './components/App.jsx';
import Layout from './components/Layout.jsx';
import NotFound from './components/NotFound.jsx';
import Router from 'react-router';  
import { NotFoundRoute, DefaultRoute, Link, Route, RouterHandler } from 'react-router';


let routes = (  
  <Route path="/" handler={App}>
    <DefaultRoute handler={Layout} />
    <NotFoundRoute handler={NotFound} />
  </Route>
  
);

Router.run(routes, Router.HistoryLocation, function (Handler) {  
  React.render(<Handler/>, document.getElementById('mountNode'));
});