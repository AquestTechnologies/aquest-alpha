import log        from './utils/logTailor';
import isClient from './utils/isClient';

export const readUniverse = createActionCreator({
  intention: 'readUniverse',
  method: 'GET',
  path: '/api/universe/{p}',
});

export const readUniverses = createActionCreator({
  intention: 'readUniverses',
  method: 'GET',
  path: '/api/universes/',
});

export const readInventory = createActionCreator({
  intention: 'readInventory',
  method: 'GET',
  path: '/api/inventory/{p}',
});

export const readTopic = createActionCreator({
  intention: 'readTopic',
  method: 'GET',
  path: '/api/topic/{p}',
});

export const readTopicContent = createActionCreator({
  intention: 'readTopicContent',
  method: 'GET',
  path: '/api/topic/content/{p}',
});

export const readChat = createActionCreator({
  intention: 'readChat',
  method: 'GET',
  path: '/api/chat/{p}',
});

export const createUniverse = createActionCreator({
  intention: 'createUniverse',
  method: 'POST',
  path: '/api/universe/',
});

export const createTopic = createActionCreator({
  intention: 'createTopic',
  method: 'POST',
  path: '/api/topic/',
});

export const createUser = createActionCreator({
  intention: 'createUser',
  method: 'POST',
  path: '/api/user/',
  overrideParams: ({pseudo, email, password}) => {
    return {pseudo, email, password};
  }
});


function createActionCreator(model) {
  
  const {intention, method, path, overrideParams} = model;
  const types = ['REQUEST', 'SUCCESS', 'FAILURE'].map(type => `${type}_${intention}`);
  
  const actionCreator = params => {
    log(`.A. ${intention} ${params}`);
    return {
      types,
      params,
      promise: promiseFetch(intention, method, path.replace(/\{\S*\}/, ''), overrideParams ? overrideParams(params) : params),
    };
  };
  
  actionCreator.getTypes = () => types;
  actionCreator.getModel = () => model;
  
  return actionCreator;
}



function promiseFetch(intention, method, path, params) {
  
  const isServer = !isClient();
  
  return new Promise((resolve, reject) => {
    
    if (isServer) {
      require('../server/queryDb')(intention, params).then(
        result => resolve(result),
        error => reject(error)
      );
      
    } else {
      console.log(`+++ --> ${method} ${intention} : `, params); //logTailor ne peut être utilisé ici
      const isPost = method === 'POST';
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
