import React       from 'react';
import App         from './components/App';
import User        from './components/User';
import Explore     from './components/Explore';
import Universe    from './components/Universe';
import Login       from './components/app/Login';
import NewUniverse from './components/NewUniverse';
import Topic       from './components/universe/Topic';
import NewTopic    from './components/universe/NewTopic';
import { isProtected } from './actionCreators';
import { Route, Redirect } from 'react-router';
import log, { logAuthentication } from './utils/logTailor';

// Adds 'safe' onEnter prop to Route whose component is protected by an actionCreator
export default function makeJourney(safe) {
  
  log('.X. Adding authentication check on routes');
  
  // Recursively checks for protected component
  function checkRoute(route) {
    const {component, children} = route.props;
    const newProps = {
      children: children && (children instanceof Array) ? children.map(child => checkRoute(child)) : undefined,
      onEnter: component && isProtected(component) ? safe : undefined,
    };
    
    return React.cloneElement(route, newProps);
  }
  
  return checkRoute(
    <Route path='/' component={App}> 
      
      <Route path='login' component={Login} />
      
      <Route path='_:universeId' component={Universe}>
        <Route path='Create_topic' component={NewTopic} />
        <Route path=':topicId' component={Topic} />
      </Route>
      
      <Route path='@:userId' component={User} />
      <Route path='Explore' component={Explore} />
      <Route path='Create_universe' component={NewUniverse} />
      
      <Redirect from='signup' to='/' />
      <Redirect from='register' to='/' />
      <Redirect from='about' to='/' />
      
    </Route>
  );
}

// Checks for Authentication in store.session
export function routeGuard(store) {
  
  return (nextState, transition) => { // RR 1.0 signature
    if (nextState.params.topicId) return; // Exception: _universe/topic gets checked because of _universe, this solves it.
    
    const {pathname} = nextState.location;
    const {userId, expiration} = store.getState().session;
    logAuthentication(`routeGuard ${pathname}`, userId, expiration);
    
    // If user is unauthenticated we save the path he wanted to go to and transition to /login
    if (!userId || expiration < new Date().getTime()) {
      log('!!! User unauthenticated: cancelling transition');
      store.dispatch({ type: 'SET_REDIRECTION', payload: pathname });
      transition.to('/login');
    }
  };
}
