import log        from './utils/logTailor';
import isClient from './utils/isClient';
const isServer = !isClient();

export const readUniverse = createActionCreator({
  intention:  'readUniverse',
  method:     'get',
  pathx:      '/api/universe/{p}',
});

export const readUniverses = createActionCreator({
  intention:  'readUniverses',
  method:     'get',
  pathx:      '/api/universes/',
});

export const readInventory = createActionCreator({
  intention:  'readInventory',
  method:     'get',
  pathx:      '/api/inventory/{p}',
});

export const readTopic = createActionCreator({
  intention:  'readTopic',
  method:     'get',
  pathx:      '/api/topic/{p}',
});

export const readTopicContent = createActionCreator({
  intention:  'readTopicContent',
  method:     'get',
  pathx:      '/api/topic/content/{p}',
});

export const readChat = createActionCreator({
  intention:  'readChat',
  method:     'get',
  pathx:      '/api/chat/{p}',
});

export const createUniverse = createActionCreator({
  intention:  'createUniverse',
  method:     'post',
  pathx:      '/api/universe/',
});

export const createTopic = createActionCreator({
  intention:  'createTopic',
  method:     'post',
  pathx:      '/api/topic/',
  mutateParams: ({id, userId, universeId, title, content, picture, description}) => {
    return {id, userId, universeId, title, content, picture, description};
  }
});

export const createUser = createActionCreator({
  intention:  'createUser',
  method:     'post',
  pathx:      '/api/user/',
  mutateParams: ({pseudo, email, password}) => {
    return {pseudo, email, password};
  }
});

// (string)   intention       the queryDb hook, used also to create actionTypes
// (string)   method          HTTP method
// (string)   path            API path. If (method && path) an corresponding API route gets created
// (function) overrideParams  allows to mutate the params before the fetching cycle
function createActionCreator(shape) {
  
  const {intention, method, pathx, mutateParams} = shape;
  const types = ['REQUEST', 'SUCCESS', 'FAILURE'].map(type => `${type}_${intention}`);
  
  const actionCreator = params => {
    log(`.A. ${intention} ${JSON.stringify(params)}`);
    
    const promise = new Promise((resolve, reject) => {
      
      // Server : direct db middleware call
      if (isServer) require('../server/queryDb')(intention, params).then(
          result => resolve(result),
          error => reject(error));
      
      // Client : API call through XMLHttpRequest
      else {
        const path = pathx.replace(/\{\S*\}/, '');
        const isPost = method === 'post';
        const req = new XMLHttpRequest();
        
        console.log(`+++ --> ${method} ${path}`, params);
        
        req.onerror = err => reject(err);
        req.open(method, isPost ? path : params ? path + params : path);
        req.onload = () => {
          if (req.status === 200) resolve(JSON.parse(req.response));
          else reject(Error(req.statusText));
        };
        
        if (isPost) req.send(createForm(mutateParams ? mutateParams(params) : params));
        else req.send();
      }
    });
    
    promise.then(
      result => {if (!isServer) console.log(`+++ <-- ${intention}`, result)}, 
      error => log('error', 'Action error', 'shape:', shape, 'params:', JSON.stringify(params), error));
    
    return {types, params, promise};
  };
  
  // getters
  actionCreator.getTypes = () => types;
  actionCreator.getShape = () => shape;
  
  return actionCreator;
}

function createForm(o) {
  let f  = new FormData();
  for(let k in o) {
    f.append(k, o[k]);
  } return f;
}
