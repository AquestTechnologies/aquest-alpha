import log from './logTailor.js';

export default function loggerMiddleware({ dispatch, getState }) {
  // log('.M. promiseMiddleware');
  
  return next => action => {
      log('dispatching', action);
      log('next state', getState());
      return next(action);
    };
}

