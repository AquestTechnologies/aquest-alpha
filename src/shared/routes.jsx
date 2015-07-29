import React        from 'react';
import { Route, Redirect }    from 'react-router';
import App          from './components/App';
import User         from './components/User';
import Topic        from './components/Topic';
import Explore      from './components/Explore';
import Universe     from './components/Universe';
import NewTopic     from './components/NewTopic';
import NewUniverse  from './components/NewUniverse';
import log          from './utils/logTailor';
import { protectedComponents } from './actionCreators';

const routes = <Route path='/' component={App}> 
  
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
  
</Route>;

function simpleAdd(a, b) {
  const c = {};
  Object.keys(a).forEach(key => a.hasOwnProperty(key) ? c[key] = a[key] : {});
  Object.keys(b).forEach(key => b.hasOwnProperty(key) ? c[key] = b[key] : {});
  return c;
}

export default function makeJourney(safe) {
  
  function checkRoute(route) {
    const {component, children, path} = route.props;
    const newChildren = children && (children instanceof Array) ? children.map(child => checkRoute(child)) : undefined;
    
    return component && protectedComponents.indexOf(component.name) !== -1 ?
      React.createElement(Route, {
        path,
        component,
        children: newChildren,
        onEnter: safe,
      }) :
      newChildren ? React.cloneElement(route, simpleAdd(route.props, {children: newChildren})) : route;
  }
  
  return checkRoute(routes);
}

export function routeGuard(store) {
  return (nextState, transition) => {
    const {userId, exp} = store.getState().session;
    log('... checking Auth for ', nextState.location.pathname, 'user is', userId ? userId : 'visitor', 'Expiration', exp ? (exp - (new Date()).getTime()) / (1000 * 60) : '0', 'minutes');
  };
}
