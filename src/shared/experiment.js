import log        from './utils/logTailor';
import isClient from './utils/isClient';
import {randomString} from './utils/randomGenerator';


export const readUniverse = createActionCreator({
  intention: 'getUniverse',
  method: 'GET',
  path: '/api/universe/',
});

export const readUniverses = createActionCreator({
  intention: 'getUniverses',
  method: 'GET',
  path: '/api/universes/',
});

export const readInventory = createActionCreator({
  intention: 'getInventory',
  method: 'GET',
  path: '/api/universe/',
});

export const readTopic = createActionCreator({
  intention: 'getTopic',
  method: 'GET',
  path: '/api/topic/',
});

export const readTopicContent = createActionCreator({
  intention: 'getTopicContent',
  method: 'GET',
  path: '/api/topic/content/',
});

export const readChat = createActionCreator({
  intention: 'getChat',
  method: 'GET',
  path: '/api/chat/',
});

export const createUniverse = createActionCreator({
  intention: 'postUniverse',
  method: 'POST',
  path: '/api/universe/',
});

export const createTopic = createActionCreator({
  intention: 'postTopic',
  method: 'POST',
  path: '/api/topic/',
});

export const createUser = createActionCreator({
  intention: 'postUser',
  method: 'POST',
  path: '/api/user/',
  paramsOverride: ({pseudo, email, password}) => {pseudo, email, password}
});


function createActionCreator(model) {
  
  const {intention, method, path, paramsOverride} = model;
  const types = ['REQUEST', 'SUCCESS', 'FAILURE'].map(type => `${type}_${intention}`);
  
  const actionCreator = params => {
    console.log(`.A. ${intention}`, params);
    return {
      types,
      params,
      promise: promiseFetch(intention, method, path, paramsOverride ? paramsOverride(params) : params),
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
