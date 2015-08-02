import React        from 'react';
import { Route, Redirect }    from 'react-router';
import App          from './components/App';
import User         from './components/User';
import Topic        from './components/Topic';
import Explore      from './components/Explore';
import Universe     from './components/Universe';
import NewTopic     from './components/NewTopic';
import NewUniverse  from './components/NewUniverse';
import log, { logAuthentication } from './utils/logTailor';
import { protectedComponents } from './actionCreators';

// Adds 'safe' onEnter prop to Route whose component is protected by an actionCreator
export default function makeJourney(safe) {
  
  log('... Adding authentication check on routes');
  
  // Recursively checks for protected component
  function checkRoute(route) {
    const {component, children} = route.props;
    const newProps = {
      children: children && (children instanceof Array) ? children.map(child => checkRoute(child)) : undefined,
      onEnter: component && protectedComponents.indexOf(component.name) !== -1 ? safe : undefined,
    };
    
    return React.cloneElement(route, newProps);
  }
  
  return checkRoute(
    <Route path='/' component={App}> 
      
      <Route path='_:universeId' component={Universe}>
        <Route path='Create_topic' component={NewTopic} />
        <Route path=':topicId' component={Topic} />
      </Route>
      
      <Route path='@:userId' component={User} />
      <Route path='Explore' component={Explore} />
      <Route path='Create_universe' component={NewUniverse} />
      
      <Redirect from='login' to='/' />
      <Redirect from='signup' to='/' />
      <Redirect from='register' to='/' />
      
    </Route>
  );
}

export function routeGuard(store) {
  
  return (nextState, transition) => {
    const {pathname} = nextState.location;
    const {userId, expiration} = store.getState().session;
    logAuthentication(`... routeGuard ${pathname}`, userId, expiration);
    
    if (!userId || expiration < new Date().getTime()) {
      log('!!! User unauthenticated: cancelling transition');
      store.dispatch({
        type: 'SET_REDIRECTION',
        payload: pathname,
      });
      transition.to('/');
    }
  };
}
