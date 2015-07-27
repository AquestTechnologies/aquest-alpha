import React        from 'react';
import {Router, Route, Redirect } from 'react-router';
import App         from './components/App';
import Home        from './components/Home';
import Universe    from './components/Universe';
import Inventory   from './components/Inventory';
import Topic       from './components/Topic';
import NewTopic    from './components/NewTopic';
import NewUniverse from './components/NewUniverse';
import Explore     from './components/Explore';
import User        from './components/User';
import NotFound    from './components/NotFound';

const routes = <Route component={App}>
    
    <Route path='_:universeId' component={Universe}>
      <Route path='new' component={NewTopic} />
      <Route path=':topicId' component={Topic} />
    </Route>
    
    <Route path='@:pseudo' component={User}>
    </Route>
    
    <Route path='Explore' component={Explore} />
    
    <Route path='Create_universe' component={NewUniverse} />
    
    <Redirect from="/login" to="/" />
  </Route>;
    

export default routes;