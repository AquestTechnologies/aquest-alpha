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

export const joinChat = (params) => ({ type: 'JOIN_CHAT_LC', payload: params });

/*export const joinChat = createSocketCreator({
  type:  'joinChat',
  auth:       'jwt',
});*/
  
export const leaveChat = (params) => ({ type: 'LEAVE_CHAT_LC', payload: params });  
/*export const leaveChat = createSocketCreator({
  type:       'leaveChat',
  auth:       'jwt',
});*/
  
export const createMessage = (params) => ({ type: 'CREATE_MESSAGE_LC', payload: params });  
/*export const createMessage = createSocketCreator({
  type:       'createMessage',
  auth:       'jwt',
});*/
  
export const receiveJoinChat =  (params) => ({ type: 'RECEIVE_JOIN_CHAT', payload: params });
  
export const receiveLeaveChat = (params) => ({ type: 'RECEIVE_LEAVE_CHAT', payload: params });
  
export const receiveMessage = (params) => ({ type: 'RECEIVE_MESSAGE', payload: params });


const actionCreators = {
  transitionTo, login, logout, 
  readUniverse, readUniverses, readInventory, readChat, readTopic, readTopicAtoms, 
  createUser, createUniverse, createTopic, 
};

export default actionCreators;

/*function createSocketCreator(shape) {
  const {type} = shape;
  const lcType = type.replace(/[A-Z]/g, '_$&').toUpperCase() + '_LC';
  
  const socketCreator = params => {
    const socket = params.socket;
    delete params.socket;
    socket.emit(type, stringifyObjectValues(params));
    
    return {type: lcType, payload: params};
  }
  
  return socketCreator;
}*/

// (string)            intention   The queryDb hook, also used to create actionTypes
// (string)            method      HTTP method
// (string)            pathx       API path. If (method && path) an corresponding API route gets created
// (string or false)   auth        Authentication strategy
function createActionCreator(shape) {
  
  const { intention, method, pathx } = shape;
  const types = ['REQUEST', 'SUCCESS', 'FAILURE']
    .map(type => `${type}_${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase());
  
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
        const path = pathx.replace(/\{\S*\}/, '');
        const isPost = method === 'post';
        const req = new XMLHttpRequest();
        log(`+++ --> ${method} ${path}`, params);
        
        req.onerror = err => reject(err);
        req.open(method, isPost ? path : params ? path + params : path);
        req.onload = () => req.status === 200 ? resolve(JSON.parse(req.response)) : reject(Error(req.statusText));
        
        if (isPost) { 
          //stringifies objects before POST XMLHttpRequest
          for (let key in params) {
            if (params.hasOwnProperty(key)) {
              const value = params[key];
              params[key] = typeof(value) === 'object' ? JSON.stringify(value) : value;
            }
          }
          req.send(createForm(params));
        }
        else req.send();
      }
    });
    
    promise.then(
      result => {
        if (!isServer) log(`+++ <-- ${intention}`, result);
      }, 
      error => {
        log('!!! Action error', error);
        log('!!! shape', shape);
        log('!!! params', params);
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
  Object.keys(params).map(value => params[value] = typeof(params[value]) === 'object' ? JSON.stringify(params[value]) : params[value])
  return params;
}

function createForm(o) {
  let f = new FormData();
  for (let k in o) { 
    if (o.hasOwnProperty(k)) f.append(k, o[k]); 
  } 
  return f;
}

const ac = Object.keys(actionCreators).map(key => actionCreators[key]);
const acAPI = ac.filter(ac => typeof ac.getShape === 'function');

const APISuccessTypes = acAPI
  .map(ac => ac.getTypes()[1]);
  
const authFailureTypes = ac
  .filter(ac => typeof ac.getShape === 'function' && ac.getShape().auth)
  .map(ac => ac.getTypes()[2]);
  
export function isAPIUnauthorized(action) {
  const { type, payload } = action;
  return authFailureTypes.indexOf(type) !== -1 && payload && payload.message === 'Unauthorized';
}

export function isAPISuccess(action) {
  return APISuccessTypes.indexOf(action.type) !== -1;
}
