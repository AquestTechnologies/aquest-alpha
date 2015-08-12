import log from './utils/logTailor';
import isClient from './utils/isClient';
const isServer = !isClient();

const actionCreators = {
  
  // Si une transition peut avoir lieu dans les sides effects alors preferer cette methode
  // Cet AC est provisoire et devra être remplacé par <Link/> partout (SEO friendly)
  transitionTo: (pathname, query, state) => ({ type: 'TRANSITION_TO', payload: {pathname, query, state} }),
  
  logout: () => ({ type: 'LOGOUT' }),

  readUniverse: createActionCreator({
    intention:  'readUniverse',
    method:     'get',
    pathx:      '/api/universe/{p}',
    auth:       false,
  }),
  
  readUniverses: createActionCreator({
    intention:  'readUniverses',
    method:     'get',
    pathx:      '/api/universes/',
    auth:       'jwt',
    component:  'Explore',
  }),
  
  readInventory: createActionCreator({
    intention:  'readInventory',
    method:     'get',
    pathx:      '/api/inventory/{p}',
    auth:       'jwt',
    component:  'Universe',
  }),
  
  readTopic: createActionCreator({
    intention:  'readTopic',
    method:     'get',
    pathx:      '/api/topic/{p}',
    auth:       false,
  }),
  
  readTopicAtoms: createActionCreator({
    intention:  'readTopicAtoms',
    method:     'get',
    pathx:      '/api/topic/content/{p}',
    auth:       false,
  }),
  
  readChat: createActionCreator({
    intention:  'readChat',
    method:     'get',
    pathx:      '/api/chat/{p}',
    auth:       false,
  }),
  
  createUniverse: createActionCreator({
    intention:  'createUniverse',
    method:     'post',
    pathx:      '/api/universe/',
    auth:       'jwt',
    component:  'NewUniverse',
  }),
  
  createTopic: createActionCreator({
    intention:  'createTopic',
    method:     'post',
    pathx:      '/api/topic/',
    auth:       'jwt',
    component:  'NewTopic',
  }),
  
  createUser: createActionCreator({
    intention:  'createUser',
    method:     'post',
    pathx:      '/api/user/',
    auth:       false,
  }),
  
  login: createActionCreator({
    intention:  'login',
    method:     'post',
    pathx:      '/login',
    auth:       false,
  }),
};


// (string)            intention   The queryDb hook, also used to create actionTypes
// (string)            method      HTTP method
// (string)            pathx       API path. If (method && path) an corresponding API route gets created
// (string or false)   auth        Authentication strategy
// (string)            component   Adds the authentication strategy to given component in routes
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
  
const protectedComponents = acAPI
  .map(ac => ac.getShape())
  .filter(s => s.auth && s.component)
  .map(s => s.component);

export function isAPIUnauthorized(action) {
  const { type, payload } = action;
  return authFailureTypes.indexOf(type) !== -1 && payload && payload.message === 'Unauthorized';
}

export function isAPISuccess(action) {
  return APISuccessTypes.indexOf(action.type) !== -1;
}

export function isProtected(component) {
  return protectedComponents.indexOf(component.name) !== -1;
}

export default actionCreators;
export const login = actionCreators.login;
export const logout = actionCreators.logout;
export const readUniverses = actionCreators.readUniverses;
export const createUniverse = actionCreators.createUniverse;
export const createUser = actionCreators.createUser;
