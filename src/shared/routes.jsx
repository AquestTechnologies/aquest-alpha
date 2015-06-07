import React        from 'react';
import {Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App         from './components/App.jsx';
import Universe    from './components/Universe.jsx';
import Explore     from './components/Explore.jsx';
import NotFound    from './components/NotFound.jsx';

let routes = (
  <Route name='root' handler={App} path='/'> 
    <DefaultRoute handler={Universe} />
    <Route name='home' path='/_:universeName' handler={Universe} />
    <Route name='explore' path='/Explore' handler={Explore} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

export default routes;