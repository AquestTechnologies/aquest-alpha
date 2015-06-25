import log from '../utils/logTailor.js';
// Copié depuis https://github.com/gaearon/redux/blob/master/docs/middleware.md

export default function promiseMiddleware(next) {
  log('.M. promiseMiddleware');
  return (action) => {
    const { promise, types, data } = action;
    if (!promise) return next(action);
    
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ data, type: REQUEST });
    
    return promise.then(
      (result) => next({ data, result, type: SUCCESS }),
      (error)  => next({ data, error,  type: FAILURE })
    );
  };
}
