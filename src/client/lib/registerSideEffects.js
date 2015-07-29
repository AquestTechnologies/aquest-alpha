import { Observable } from 'rx';
import docCookies from '../vendor/cookie';
import log from '../../shared/utils/logTailor';
import { isUnauthorized } from '../../shared/actionCreators';

export default function registerSideEffects(store, transitionTo) {

  let redirection = '';
    
  // https://github.com/acdlite/redux-rx/blob/master/src/observableFromStore.js
  Observable.create(observer => store.subscribe(() => observer.onNext(store.getState().records)))
    .subscribe(records => {
      const action = records[records.length - 1].action;
      const {type, payload} = action;
      
      if (isUnauthorized(action)) {
        redirection = store.getState().router.pathname;
        log('.E. Unauthorized access, will redirect to', redirection);
        transitionTo('/');
      }
      
      switch (type) {
        
        case 'TRANSITION_TO':
          const {pathname, query, state} = payload;
          log('.E. transitionTo ', pathname, query, state);
          transitionTo(pathname, query, state);
          break;
        
        case 'SUCCESS_LOGIN': 
          log('.E. setting cookie', payload.token);
          docCookies.setItem('jwt', payload.token, 60);
          transitionTo(redirection ? redirection : '/Explore');
          redirection = '';
          break;
        
        case 'SUCCESS_CREATE_USER':
          log('.E. setting cookie', payload.token);
          docCookies.setItem('jwt', payload.token, 60);
          transitionTo(redirection ? redirection : '/Explore');
          redirection = '';
          break;
        
      }
    });
    
}