import React        from 'react';
import { Route } from 'react-router';

import App         from './components/App';
// import Home        from './components/Home';
import Universe    from './components/Universe';
import Inventory   from './components/Inventory';
import Topic       from './components/Topic';
import NewTopic    from './components/NewTopic';
import NewUniverse from './components/NewUniverse';
import Explore     from './components/Explore';
import User        from './components/User';
// import NotFound    from './components/NotFound';

let routes = (
  <Route path='/' component={App}> 
  
    {/*<Route path='/' component={Home} />*/}
    
    <Route path='/_:universeId' component={Universe}>
      <Route path='/:topicId' component={Topic} />
      <Route path='/Create_topic' component={NewTopic} />
    </Route>
    
    <Route path='/@:userId' component={User} />
    
    <Route path='/Explore' component={Explore} />
    
    <Route path='/Create_universe' component={NewUniverse} />
    
    {/*<NotFoundRoute component={NotFound}/>*/}
    
  </Route>
);

export default routes;