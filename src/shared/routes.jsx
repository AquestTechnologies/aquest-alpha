import React        from 'react';
import { Route }    from 'react-router';
import App          from './components/App';
import User         from './components/User';
import Topic        from './components/Topic';
import Explore      from './components/Explore';
import Universe     from './components/Universe';
import NewTopic     from './components/NewTopic';
import NewUniverse  from './components/NewUniverse';
import docCookies   from '../client/vendor/cookie';
import log          from './utils/logTailor';
import isClient     from './utils/isClient';

const isServer = !isClient();
function checkAuth(nextState, transition) {
  log('... checking Auth for ', nextState.location.pathname);
}

let routes = (
  <Route path='/' component={App}> 
        
    <Route path='_:universeId' component={Universe} onEnter={checkAuth}>
      <Route path='Create_topic' component={NewTopic} onEnter={checkAuth} />
      <Route path=':topicId' component={Topic} />
    </Route>
    
    <Route path='@:userId' component={User} onEnter={checkAuth} />
    
    <Route path='Explore' component={Explore} onEnter={checkAuth} />
    
    <Route path='Create_universe' component={NewUniverse} onEnter={checkAuth} />
    
    
  </Route>
);

export default routes;