import log        from './utils/logTailor';
import {isServer} from './utils/isClient';

export const readUniverse = createActionCreator({
  intention: 'readUniverse',
  method: 'get',
  path: '/api/universe/{p}',
});

export const readUniverses = createActionCreator({
  intention: 'readUniverses',
  method: 'get',
  path: '/api/universes/',
});

export const readInventory = createActionCreator({
  intention: 'readInventory',
  method: 'get',
  path: '/api/inventory/{p}',
});

export const readTopic = createActionCreator({
  intention: 'readTopic',
  method: 'get',
  path: '/api/topic/{p}',
});

export const readTopicContent = createActionCreator({
  intention: 'readTopicContent',
  method: 'get',
  path: '/api/topic/content/{p}',
});

export const readChat = createActionCreator({
  intention: 'readChat',
  method: 'get',
  path: '/api/chat/{p}',
});

export const createUniverse = createActionCreator({
  intention: 'createUniverse',
  method: 'post',
  path: '/api/universe/',
});

export const createTopic = createActionCreator({
  intention: 'createTopic',
  method: 'post',
  path: '/api/topic/',
});

export const createUser = createActionCreator({
  intention: 'createUser',
  method: 'post',
  path: '/api/user/',
  overrideParams: ({pseudo, email, password}) => {
    return {pseudo, email, password};
  }
});


function createActionCreator(shape) {
  // (string)   intention       the queryDb hook, used also to create actionTypes
  // (string)   method          HTTP method
  // (string)   path            API path. If (method && path) an corresponding API route gets created
  // (function) overrideParams  allows to mutate the params before the fetching cycle
  const {intention, method, path, overrideParams} = shape;
  const types = ['REQUEST', 'SUCCESS', 'FAILURE'].map(type => `${type}_${intention}`);
  
  const actionCreator = params => {
    log(`.A. ${intention} ${JSON.stringify(params)}`);
    return {
      types,
      params,
      promise: selectChannelToDB(intention, method, path.replace(/\{\S*\}/, ''), overrideParams ? overrideParams(params) : params),
    };
  };
  // getters
  actionCreator.getTypes = () => types;
  actionCreator.getShape = () => shape;
  
  return actionCreator;
}

// Selects the data fetching channel based on environnement
function selectChannelToDB(intention, method, path, params) {
  
  return new Promise((resolve, reject) => {
    
    if (isServer()) {
      // API override, calling directly middleware
      require('../server/queryDb')(intention, params).then(
        result => resolve(result),
        error => reject(error)
      );
      
    } else {
      // API call through XMLHttpRequest from client
      console.log(`+++ --> ${method} ${intention} : `, params);
      const isPost = method === 'post';
      const req = new XMLHttpRequest();
      req.open(method, isPost ? path : params ? path + params : path);
      
      req.onerror = () => reject(Error("Error during HTTP request"));
      req.onload = () => {
        if (req.status === 200) {
          const result = JSON.parse(req.response);
          console.log(`+++ <-- ${intention} : `, result);
          resolve(result);
        } else {
          reject(Error(req.statusText));
        }
      };
      
      const createForm = () => {
        let f  = new FormData();
        for(let key in params) {
          f.append(key, params[key]);
        }
        return f;
      };
      
      if (isPost) req.send(createForm());
      else req.send();
    }
  });
}
