import { Observable } from 'rx';
import docCookies from '../vendor/cookie';
import log from '../../shared/utils/logTailor';
import * as actionCreators from '../../shared/actionCreators';

export default function registerSideEffects(store, transitionTo) {
  
  const authFailureTypes = Object.keys(actionCreators)
    .map(key => actionCreators[key])
    .filter(ac => typeof ac.getShape === 'function' && ac.getShape().auth)
    .map(ac => ac.getTypes()[2]);
    
  // https://github.com/acdlite/redux-rx/blob/master/src/observableFromStore.js
  Observable.create(observer => store.subscribe(() => observer.onNext(store.getState().records)))
    .subscribe(records => {
      const {type, payload} = records[records.length - 1].action;
      
      if (authFailureTypes.indexOf(type) !== -1 && payload.message === 'Unauthorized') {
        log('.E. Unauthorized access');
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
          transitionTo('/Explore');
          break;
        
        case 'SUCCESS_CREATE_USER':
          log('.E. setting cookie', payload.token);
          docCookies.setItem('jwt', payload.token, 60);
          transitionTo('/Explore');
          break;
        
      }
    });
    
}