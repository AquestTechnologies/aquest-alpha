import { observableFromStore } from 'redux-rx';

export default function registerSideEffects(store, router) {
  
  observableFromStore(store)
    .distinctUntilChanged(state => state.effects)
    .filter(state => state.effects)
    .subscribe(state => {
      
      const {did, jwt} = state.effects;
      if (did) switch (did) {
        case 'login': 
          console.log('setting jwt', jwt);
          localStorage.setItem('jwt', jwt);
          router.transitionTo('explore');
          break;
          
        case 'createUser': 
          router.transitionTo('explore');
          break;
          
        case 'createTopic':
          console.log(state.effects);
          break;
      }
      
    });
    
}