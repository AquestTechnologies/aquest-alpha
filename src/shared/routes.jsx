import React        from 'react';
import {Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App         from './components/App.jsx';
import Universe    from './components/Universe.jsx';
import Inventory   from './components/universe/Inventory.jsx';
import Topic       from './components/universe/Topic.jsx';
import NewTopic    from './components/universe/NewTopic.jsx';
import Explore     from './components/Explore.jsx';
import NotFound    from './components/NotFound.jsx';

let routes = (
  <Route handler={App}> 
  
    <Route name='home' path='/' handler={Universe}>
      <DefaultRoute handler={Inventory} />
    </Route> 
    
    <Route name='universe' path='/_:universeName' handler={Universe}>
      <DefaultRoute handler={Inventory} />
      <Route name='topic' path=':topicHandle' handler={Topic} />
      <Route name='newTopic' path='new' handler={NewTopic} />
    </Route>
    
    <Route name='explore' path='/Explore' handler={Explore} />
    
    <NotFoundRoute handler={NotFound}/>
    
  </Route>
);

export default routes;