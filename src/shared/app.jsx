import React from 'react';
import App from './components/App.jsx';
import Layout from './components/Layout.jsx';
import NotFound from './components/NotFound.jsx';
import Router from 'react-router';  
import { NotFoundRoute, DefaultRoute, Link, Route, RouterHandler } from 'react-router';
import routes from './routes.jsx';

Router.run(routes, Router.HistoryLocation, function (Handler) {  
  React.render(<Handler/>, document.getElementById('mountNode'));
});

