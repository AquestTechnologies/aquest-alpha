import log from './logTailor.js';
// Copié depuis https://github.com/gaearon/redux/blob/master/docs/middleware.md
// Modifié depuis

export default function promiseMiddleware({ dispatch, getState }) {
  // log('.M. promiseMiddleware');
  
  return next => action => {
    const {promise, types, params} = action;
    
    if (!promise) return next(action);
    
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({params, type: REQUEST});
    
    return promise.then(
    payload => {
      // log(payload);
      next({params, payload, type: SUCCESS});
      return payload; // Pour phidippides
    },
    payload => {
      log('error', payload);
      next({params, payload, type: FAILURE}); 
      return payload;
    });
  };
}

