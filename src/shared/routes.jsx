import React        from 'react';
import {Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App         from './components/App';
import Universe    from './components/Universe';
import Inventory   from './components/Inventory';
import Topic       from './components/Topic';
import TopicNew    from './components/TopicNew';
import Explore     from './components/Explore';
import User        from './components/User';
import NotFound    from './components/NotFound';

let routes = (
  <Route handler={App}> 
  
    <Route name='home' path='/' handler={Universe}>
      <DefaultRoute handler={Inventory} />
    </Route> 
    
    <Route name='universe' path='/_:universeId' handler={Universe}>
      <DefaultRoute handler={Inventory} />
      <Route name='newTopic' path='new' handler={TopicNew} />
      <Route name='topic' path=':topicId' handler={Topic} />
    </Route>
    
    <Route name='user' path='/@:pseudo' handler={User}>
    </Route>
    
    <Route name='explore' path='/Explore' handler={Explore} />
    
    <NotFoundRoute handler={NotFound}/>
    
  </Route>
);

export default routes;