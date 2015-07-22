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
    
    promise.then(
      payload => next({params, payload, type: SUCCESS}),
      payload => next({params, payload, type: FAILURE}));
  };
}

