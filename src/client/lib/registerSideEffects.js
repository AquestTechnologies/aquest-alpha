import { Observable } from 'rx';
import docCookies from '../vendor/cookie';
import log from '../../shared/utils/logTailor';
import { isAPIUnauthorized } from '../../shared/actionCreators';

export default function registerSideEffects(store, transitionTo) {
  
  const logR = type => log('.E. redirecting after', type);
  const setRedirection = path => store.dispatch({
    type: 'SET_REDIRECTION',
    payload: path,
  });
  
  // https://github.com/acdlite/redux-rx/blob/master/src/observableFromStore.js
  Observable.create(observer => store.subscribe(() => observer.onNext(store.getState())))
    .subscribe(state => {
      const action = state.records[state.records.length - 1];
      const {type, payload} = action;
      
      if (isAPIUnauthorized(action)) {
        const currentPath = store.getState().router.pathname;
        log('.E. Unauthorized access, will redirect to', currentPath);
        docCookies.removeItem('jwt');
        setRedirection(currentPath);
        transitionTo('/login');
        return;
      }
      
      if (type === 'SUCCESS_LOGIN' || type === 'SUCCESS_CREATE_USER') {
        logR(type);
        const {redirection} = state.session;
        const {query} = state.router; 
        const r = query ? query.r : undefined;
        transitionTo(r ? r : redirection ? redirection : '/Explore');
        setRedirection('');
        return;
      } 
      
      switch (type) {
        
        case 'TRANSITION_TO':
          const {pathname, query, state} = payload;
          log('.E. transitionTo ', pathname, query, state);
          transitionTo(pathname, query, state);
          return;
          
        case 'LOGOUT':
          logR(type);
          docCookies.removeItem('jwt');
          transitionTo('/');
          return;
          
        case 'SUCCESS_CREATE_UNIVERSE':
          logR(type);
          transitionTo(`/_${payload.id}`);
          return;
          
        case 'SUCCESS_CREATE_TOPIC':
          const { id, universeId } = payload;
          logR(type);
          transitionTo(`/_${universeId}/${id}`);
          return;
      }
    });
}
