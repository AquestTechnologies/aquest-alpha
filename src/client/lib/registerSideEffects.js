import log                  from '../../shared/utils/logTailor';
import * as actionCreators  from '../../shared/actionCreators';
import { Observable }       from 'rx';
import io                   from 'socket.io-client';
import docCookies           from '../vendor/cookie';

export default function registerSideEffects(store, router) {
  
  const authFailureTypes = Object.keys(actionCreators)
    .map(key => actionCreators[key])
    .filter(ac => ac.getShape().auth)
    .map(ac => ac.getTypes()[2]);
  
  // https://github.com/acdlite/redux-rx/blob/master/src/observableFromStore.js
  Observable.create(observer => store.subscribe(() => observer.onNext(store.getState().records)))
    .subscribe(records => {
      const {type, payload} = records[records.length - 1].action;
      
      if (authFailureTypes.indexOf(type) !== -1 && payload.message === 'Unauthorized') router.transitionTo('home');
      
      switch (type) {
        
        case 'SUCCESS_LOGIN': 
          log('... setting jwt', payload.token);
          localStorage.setItem('jwt', payload.token);
          localStorage.setItem('userId', payload.id);
          router.transitionTo('explore');
          break;
          
        case 'SUCCESS_CREATE_USER':
          log('... setting jwt', payload.token);
          localStorage.setItem('jwt', payload.token);
          localStorage.setItem('userId', payload.id);
          router.transitionTo('explore');
          break;
          
        case 'SUCCESS_CREATE_TOPIC':
          log('... setting jwt', payload.token);
          localStorage.setItem('jwt', payload.token); 
          router.transitionTo('_' + payload.universeId + '/' + payload.id);
          break;
      }
    });
    
}