// Copié depuis https://github.com/gaearon/redux/blob/master/docs/middleware.md
/*export default function promiseMiddleware(next) {
  return (action) => {
    console.log('... promiseMiddleware return');
    console.log('... promiseMiddleware action :');
    console.log(action);
    console.log('... promiseMiddleware next :');
    console.log(next);
    action && typeof action.then === 'function'
      ? action.then(next)
      : next(action);
  };
}
*/
// ou sinon :
// https://github.com/gaearon/redux/issues/99#issuecomment-112212639
/*export default function promiseMiddleware() {
  return (next) => (action) => {
    console.log('.M. promiseMiddleware');
    const { promise, types, data } = action;
    console.log(promise);
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ data, type: REQUEST });
    return promise.then(
      (result) => next({ data, result, type: SUCCESS }),
      (error) => next({ data, error, type: FAILURE })
    );
  };
}*/

/*export default function promiseMiddleware() {
  return (next) => (action) => {
    console.log('.M. promiseMiddleware');
    const { promise, types, data } = action;
    console.log(promise);
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ data, type: REQUEST });
    return promise.then(
      (result) => next({ data, result, type: SUCCESS }),
      (error) => next({ data, error, type: FAILURE })
    );
  };
  
  console.log('.M. promiseMiddleware');
  return function (next) {
    console.log('.M. promiseMiddleware next');
    return function (action) {
      console.log('.M. promiseMiddleware action');
      console.log(action);
      const { promise, types, data } = action;
      if (!promise) {
        return next(action);
      }
  
      const [REQUEST, SUCCESS, FAILURE] = types;
      next({ data, type: REQUEST });
      return promise.then(
        (result) => next({ data, result, type: SUCCESS }),
        (error) => next({ data, error, type: FAILURE })
      );
    }
  }
}*/

/*export default function promiseMiddleware() {
  return (next) => {
    return (action) => {
      console.log('.M. promiseMiddleware');
      const { promise, types, data } = action;
      console.log(promise);
      if (!promise) {
        return next(action);
      }
  
      const [REQUEST, SUCCESS, FAILURE] = types;
      next({ data, type: REQUEST });
      return promise.then(
        (result) => next({ data, result, type: SUCCESS }),
        (error) => next({ data, error, type: FAILURE })
      );
    };
  }
}*/

export default function promiseMiddleware(next) {
  console.log('.M. promiseMiddleware');
  return (action) => {
    const { promise, types, data } = action;
    if (!promise) {
      return next(action);
    } 
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ data, type: REQUEST });
    return promise.then(
      (result) => next({ data, result, type: SUCCESS }),
      (error) => next({ data, error, type: FAILURE })
    );
  };
}

/*export default function promiseMiddleware() {
  return (action) => {
    console.log('.M. promiseMiddleware');
    const { promise, types, data } = action;
    console.log(promise);
    if (!promise) {
      return next(action);
    } 
    console.log('ici');
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ data, type: REQUEST });
    return promise.then(
      (result) => next({ data, result, type: SUCCESS }),
      (error) => next({ data, error, type: FAILURE })
    );
  };
}*/

/*export default function promiseMiddleware() {
  console.log('.M. promiseMiddleware');
  return (next) => {
    console.log('... promiseMiddleware return');
    const recurse = (action) => {
      console.log('.M. promiseMiddleware recurse');
      console.log(action);
      const { promise, types, data } = action;
      if (!promise) {
        return next(action);
      } 
      console.log('ici');
      const [REQUEST, SUCCESS, FAILURE] = types;
      next({ data, type: REQUEST });
      return promise.then(
        (result) => next({ data, result, type: SUCCESS }),
        (error) => next({ data, error, type: FAILURE })
      );
    }

    return recurse;
  };
}*/