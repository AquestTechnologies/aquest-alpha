import log from '../../shared/utils/logTailor';
import * as actionCreators from '../../shared/actionCreators';
import { Observable } from 'rx';

export default function registerSideEffects(store, router) {
  
  const authFailureTypes = Object.keys(actionCreators)
    .map(key => actionCreators[key])
    .filter(ac => ac.getShape().auth)
    .map(ac => ac.getTypes()[2]);
  
  // https://github.com/acdlite/redux-rx/blob/master/src/observableFromStore.js
  Observable.create(observer => store.subscribe(() => observer.onNext(store.getState().records)))
    .subscribe(records => {
      const {type, payload} = records[records.length - 1].action;
      console.log('... registerSideEffects', type);
      
      if (authFailureTypes.indexOf(type) !== -1 && payload.message === 'Unauthorized') router.transitionTo('home');
      
      switch (type) {
        
        case 'SUCCESS_LOGIN': 
          log('... setting jwt', payload.token);
          localStorage.setItem('jwt', payload.token);
          router.transitionTo('explore');
          break;
          
        case 'SUCCESS_CREATE_USER':
          router.transitionTo('explore');
          break;
          
      }
    });
    
}