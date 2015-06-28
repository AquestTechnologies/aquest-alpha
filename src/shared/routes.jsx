import React        from 'react';
import {Route, DefaultRoute, NotFoundRoute } from 'react-router';

import App         from './components/App';
import Universe    from './components/Universe';
import Inventory   from './components/universe/Inventory';
import Topic       from './components/universe/Topic';
import TopicNew    from './components/universe/TopicNew';
import Explore     from './components/Explore';
import NotFound    from './components/NotFound';

let routes = (
  <Route handler={App}> 
  
    <Route name='home' path='/' handler={Universe}>
      <DefaultRoute handler={Inventory} />
    </Route> 
    
    <Route name='universe' path='/_:universeHandle' handler={Universe}>
      <DefaultRoute handler={Inventory} />
      <Route name='newTopic' path='new' handler={TopicNew} />
      <Route name='topic' path=':topicHandle' handler={Topic} />
    </Route>
    
    <Route name='explore' path='/Explore' handler={Explore} />
    
    <NotFoundRoute handler={NotFound}/>
    
  </Route>
);

export default routes;