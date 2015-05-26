import React from 'react';
import Layout from './components/Layout.jsx';
import NotFound from './components/NotFound.jsx';
import Router from 'react-router';  
import { NotFoundRoute, DefaultRoute, Link, Route, RouteHandler } from 'react-router';

class App extends React.Component {
  render() {
    return (
      <RouteHandler />
    );
  }
}

let routes = (  
  <Route path="/" handler={Layout}>
   /* <DefaultRoute handler={Layout} />*/
    <NotFoundRoute handler={NotFound}/>
  </Route>
  
);

Router.run(routes, Router.HistoryLocation, function (Handler) {  
  React.render(<Handler/>, document.getElementById('mountNode'));
});