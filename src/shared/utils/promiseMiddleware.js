import log from './logTailor.js';
// Copié depuis https://github.com/gaearon/redux/blob/master/docs/middleware.md

export default function promiseMiddleware(next) {
  log('.M. promiseMiddleware');
  return (action) => {
    const { promise, types, params } = action;
    if (!promise) return next(action);
    
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ params, type: REQUEST });
    
    /*return promise.then(
      (result) => next({ params, result, type: SUCCESS })
    ).catch(
      (error)  => next({ params, error,  type: FAILURE })
    );*/
    
    return promise.then(function(result){
      // log('promiseMiddleware --> SUCCESS');
      // log(result);
      next({ params, result, type: SUCCESS });
      return result;
    }).catch(function(error){
      console.log(error);
      // log('promiseMiddleware --> failed : ' + error);
      next({ params, error,  type: FAILURE }); 
      return error;
    });
  };
}
