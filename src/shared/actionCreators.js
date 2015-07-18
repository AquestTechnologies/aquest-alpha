import log        from './utils/logTailor';
import {isServer} from './utils/isClient';

export const readUniverse = createActionCreator({
  intention: 'readUniverse',
  method: 'get',
  pathx: '/api/universe/{p}',
});

export const readUniverses = createActionCreator({
  intention: 'readUniverses',
  method: 'get',
  pathx: '/api/universes/',
});

export const readInventory = createActionCreator({
  intention: 'readInventory',
  method: 'get',
  pathx: '/api/inventory/{p}',
});

export const readTopic = createActionCreator({
  intention: 'readTopic',
  method: 'get',
  pathx: '/api/topic/{p}',
});

export const readTopicContent = createActionCreator({
  intention: 'readTopicContent',
  method: 'get',
  pathx: '/api/topic/content/{p}',
});

export const readChat = createActionCreator({
  intention: 'readChat',
  method: 'get',
  pathx: '/api/chat/{p}',
});

export const createUniverse = createActionCreator({
  intention: 'createUniverse',
  method: 'post',
  pathx: '/api/universe/',
});

export const createTopic = createActionCreator({
  intention: 'createTopic',
  method: 'post',
  pathx: '/api/topic/',
});

export const createUser = createActionCreator({
  intention: 'createUser',
  method: 'post',
  pathx: '/api/user/',
  mutateParams: ({pseudo, email, password}) => {
    return {pseudo, email, password};
  }
});


function createActionCreator(shape) {
  // (string)   intention       the queryDb hook, used also to create actionTypes
  // (string)   method          HTTP method
  // (string)   path            API path. If (method && path) an corresponding API route gets created
  // (function) overrideParams  allows to mutate the params before the fetching cycle
  const {intention, method, pathx, mutateParams} = shape;
  const types = ['REQUEST', 'SUCCESS', 'FAILURE'].map(type => `${type}_${intention}`);
  
  const actionCreator = params => {
    log(`.A. ${intention} ${JSON.stringify(params)}`);
    
    const promise = new Promise((resolve, reject) => {
      // API override, calling directly middleware
      if (isServer()) { 
        require('../server/queryDb')(intention, params).then(
          result => resolve(result),
          error => reject(error));
      
      // API call through XMLHttpRequest from client
      } else {
        const path = pathx.replace(/\{\S*\}/, '');
        const isPost = method === 'post';
        const req = new XMLHttpRequest();
        console.log(`+++ --> ${method} ${path}`, params);
        
        req.onerror = err => reject(err);
        req.open(method, isPost ? path : params ? path + params : path);
        req.onload = () => {
          if (req.status === 200) {
            const result = JSON.parse(req.response);
            console.log(`+++ <-- ${intention}`, result);
            resolve(result);
            
          } else reject(Error(req.statusText));
        };
        
        if (isPost) req.send(createForm(mutateParams ? mutateParams(params) : params));
        else req.send();
      }
    });
    
    promise.then(() => {}, error => log('error', 'Action error', 'shape:', shape, 'params:', JSON.stringify(params), error));
    
    return {types, params, promise,};
  };
  
  // getters
  actionCreator.getTypes = () => types;
  actionCreator.getShape = () => shape;
  
  return actionCreator;
}

function createForm(params) {
  let f  = new FormData();
  for(let key in params) {
    f.append(key, params[key]);
  }
  
  return f;
}
