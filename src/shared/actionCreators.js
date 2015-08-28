import log from './utils/logTailor';
import isClient from './utils/isClient';
const isServer = !isClient();

// Si une transition peut avoir lieu dans les sides effects alors preferer cette methode
// Cet AC est provisoire et devra être remplacé par <Link/> partout (SEO friendly)
export const transitionTo = (pathname, query, state) => ({ type: 'TRANSITION_TO', payload: {pathname, query, state} });

export const logout = () => ({ type: 'LOGOUT' });

export const readUniverse = createActionCreator({
  intention:  'readUniverse',
  method:     'get',
  pathx:      '/api/universe/{p}',
  auth:       false,
});

export const readUniverses = createActionCreator({
  intention:  'readUniverses',
  method:     'get',
  pathx:      '/api/universes/',
  auth:       'jwt',
});

export const readInventory = createActionCreator({
  intention:  'readInventory',
  method:     'get',
  pathx:      '/api/inventory/{p}',
  auth:       'jwt',
});

export const readTopic = createActionCreator({
  intention:  'readTopic',
  method:     'get',
  pathx:      '/api/topic/{p}',
  auth:       false,
});

export const readTopicAtoms = createActionCreator({
  intention:  'readTopicAtoms',
  method:     'get',
  pathx:      '/api/topicAtoms/{p}',
  auth:       false,
});

export const readChat = createActionCreator({
  intention:  'readChat',
  method:     'get',
  pathx:      '/api/chat/{p}',
  auth:       false,
});

export const readChatOffset = createActionCreator({
  intention:  'readChatOffset',
  method:     'get',
  pathx:      '/api/chat/{chatId}/offset/{offset}', 
  auth:       false,
});

export const createUniverse = createActionCreator({
  intention:  'createUniverse',
  method:     'post',
  pathx:      '/api/universe/',
  auth:       'jwt',
});

export const createTopic = createActionCreator({
  intention:  'createTopic',
  method:     'post',
  pathx:      '/api/topic/',
  auth:       'jwt',
});

export const createUser = createActionCreator({
  intention:  'createUser',
  method:     'post',
  pathx:      '/api/user/',
  auth:       false,
});

export const login = createActionCreator({
  intention:  'login',
  method:     'post',
  pathx:      '/login',
  auth:       false,
});

export const joinChat = (params) => ({ type: 'JOIN_CHAT', payload: params });
  
export const leaveChat = (params) => ({ type: 'LEAVE_CHAT', payload: params });  
  
export const createMessage = (params) => ({ type: 'CREATE_MESSAGE', payload: params });  
  
export const receiveJoinChat =  (params) => ({ type: 'RECEIVE_JOIN_CHAT', payload: params });
  
export const receiveLeaveChat = (params) => ({ type: 'RECEIVE_LEAVE_CHAT', payload: params });
  
export const receiveMessage = (params) => ({ type: 'RECEIVE_MESSAGE', payload: params });


export function uploadFile(params, fnProgress, fnUpload, fnResponse) {
  const types = ['REQUEST_UPLOAD_FILE', 'SUCCESS_UPLOAD_FILE', 'FAILURE_UPLOAD_FILE'];
  
  const promise = new Promise((resolve, reject) => {
    
    const onUpload = typeof fnUpload === 'function' ? fnUpload : (() => {});
    const onProgress = typeof fnProgress === 'function' ? fnProgress : (() => {});
    const onResponse = typeof fnResponse === 'function' ? fnResponse : (() => {});
    
    const req = new XMLHttpRequest();
    req.upload.addEventListener('load', onUpload);
    req.upload.addEventListener('progress', onProgress);
    req.onerror = err => reject(err);
    req.open('post', '/uploadFile');
    req.onload = () => {
      const { status, response, statusText } = req;
      if (status === 200) {
        const result = JSON.parse(response);
        onResponse(true, result); // Cela brise le flow Flux...
        resolve(result);
      } else {
        onResponse(false, statusText);
        reject(Error(statusText));
      }
    };
    req.send(createForm(params));
    
  });
  
  return {types, promise, params};
}

const actionCreators = {
  transitionTo, login, logout, uploadFile,
  readUniverse, readUniverses, readInventory, readChat, readTopic, readTopicAtoms, 
  createUser, createUniverse, createTopic, 
  joinChat, leaveChat, createMessage, receiveJoinChat, receiveLeaveChat, receiveMessage
};

export default actionCreators;

// (string)            intention   The queryDb hook, also used to create actionTypes
// (string)            method      HTTP method
// (string)            pathx       API path. If (method && path) an corresponding API route gets created
// (string or false)   auth        Authentication strategy
function createActionCreator(shape) {
  
  const { intention, method, pathx } = shape;
  const types = ['REQUEST', 'SUCCESS', 'FAILURE'].map(t => `${t}_${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase());
  
  const actionCreator = params => {
    log('.A.', intention, params ? JSON.stringify(params) : '');
    const promise = new Promise((resolve, reject) => {
      
      // Server : direct db middleware call
      if (isServer) require('../server/queryDb')(intention, params).then(
        result => resolve(result),
        error => reject(error)
      );
      
      // Client : API call through XMLHttpRequest
      else {
        const isPost = method === 'post';
        const path = isPost ? 
          pathx : params ? 
            pathx.replace(/{([A-Za-z]*)}/g, (match, p1, offset, string) => typeof params === 'object' ? params[p1] : params) : pathx;
            
        const xhr = new XMLHttpRequest();
        log(`+++ --> ${method} ${path}`, params);
        
        xhr.onerror = err => reject(err);
        xhr.open(method, isPost ? path : params ? path + params : path);
        xhr.onload = () => xhr.status === 200 ? 
          resolve(JSON.parse(xhr.response)) : 
          reject({
            intention,
            status: xhr.status,
            response: xhr.response,
          });
        
        if (isPost) { // Stringifies objects before a POST request
          for (let key in params) {
            if (params.hasOwnProperty(key)) {
              const value = params[key];
              params[key] = typeof(value) === 'object' ? JSON.stringify(value) : value;
            }
          }
          xhr.send(createForm(params));
        }
        else xhr.send();
      }
    });
    
    promise.then(
      result => {
        if (!isServer) log(`+++ <-- ${intention}`, result);
      }, 
      ({ status, response, intention }) => {
        log('!!! API Action error', intention);
        log('!!! params', params);
        log('!!! response', status, response);
      });
    
    return { types, params, promise };
  };
  
  // getters
  actionCreator.getTypes = () => types;
  actionCreator.getShape = () => shape;
  
  return actionCreator;
}

//stringify objects value before send params to the server
function stringifyObjectValues(params){
  Object.keys(params).map(value => params[value] = typeof(params[value]) === 'object' ? JSON.stringify(params[value]) : params[value]);
  return params;
}

function createForm(o) {
  let f = new FormData();
  for (let k in o) { 
    if (o.hasOwnProperty(k)) f.append(k, o[k]); 
  } 
  return f;
}

const acAPI = Object.keys(actionCreators)
  .map(key => actionCreators[key])
  .filter(ac => typeof ac.getTypes === 'function');

const APISuccessTypes = acAPI
  .map(ac => ac.getTypes()[1]);
  
const APIFailureTypes = acAPI
  .map(ac => ac.getTypes()[2]);
  
const APIAuthFailureTypes = acAPI
  .filter(ac => ac.getShape().auth)
  .map(ac => ac.getTypes()[2]);
  
export function isAPIUnauthorized(action) {
  const { type, payload } = action;
  return APIAuthFailureTypes.indexOf(type) !== -1 && payload && payload.status === 401;
}

export function isAPISuccess(action) {
  return APISuccessTypes.indexOf(action.type) !== -1;
}

export function isAPIFailure(action) {
  return APIFailureTypes.indexOf(action.type) !== -1;
}

// function convertIntentionToType(intention, subType) {
//   return `${subType}_${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase();
// }

// function convertTypeToIntention(type) {
//   if (!/REQUEST|SUCCESS|FAILURE/.test(type.substr(0, 7))) return false;
  
//   return type.substr(8).split('_').map((s, i) => i ? s.toLowerCase() : s.substr(0, 1) + s.substr(1).toLowerCase()).join();
// }
