import { Observable } from 'rx';
import docCookies from '../vendor/cookie';
import log from '../../shared/utils/logTailor';
import config from '../../../config/client';
import { isUnauthorized } from '../../shared/actionCreators';

export default function registerSideEffects(store, transitionTo) {
  
  const setRedirection = path => store.dispatch({
    type: 'SET_REDIRECTION',
    payload: path,
  });
  
  // https://github.com/acdlite/redux-rx/blob/master/src/observableFromStore.js
  Observable.create(observer => store.subscribe(() => observer.onNext(store.getState())))
    .subscribe(state => {
      const action = state.records[state.records.length - 1].action;
      const {type, payload} = action;
      
      if (isUnauthorized(action)) {
        const currentPath = store.getState().router.pathname;
        log('.E. Unauthorized access, will redirect to', currentPath);
        setRedirection(currentPath);
        transitionTo('/');
        return;
      }
      
      if (type === 'SUCCESS_LOGIN' || type === 'SUCCESS_CREATE_USER') {
        log('.E. Redirecting after', type);
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
          break;
      }
    });
}