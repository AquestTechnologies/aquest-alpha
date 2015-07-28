import log        from './utils/logTailor';
import isClient from './utils/isClient';
const isServer = !isClient();

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

export const readTopicContent = createActionCreator({
  intention:  'readTopicContent',
  method:     'get',
  pathx:      '/api/topic/content/{p}',
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

export const createMessage = createActionCreator({
  intention:  'createMessage',
  method:     'socket',
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

// (string)   intention   The queryDb hook, also used to create actionTypes
// (string)   method      HTTP method
// (string)   pathx       API path. If (method && path) an corresponding API route gets created
function createActionCreator(shape) {
  const {intention, method, pathx} = shape;
  const types = ['REQUEST', 'SUCCESS', 'FAILURE']
    .map(type => `${type}_${intention.replace(/[A-Z]/g, '_$&')}`.toUpperCase());
  
  const actionCreator = params => {
    log(`.A. ${intention} ${JSON.stringify(params)}`);
    const promise = new Promise((resolve, reject) => {
      
      // Server : direct db middleware call
      if (isServer) require('../server/queryDb')(intention, params).then(
          result => resolve(result),
          error => reject(error));
      
      // Client : API call through XMLHttpRequest
      else {
        if(method === 'socket'){
          // socketio included in index.html <script src="http://<ip>:9090/socket.io/socket.io.js"></script>
          let socket = io.connect('http://130.211.59.69:9090/');
          
          Object.keys(params).map(value => params[value] = typeof(params[value]) === 'object' ? JSON.stringify(params[value]) : params[value]);
          
          socket.emit(intention,{intention, params});
          socket.on(intention, (result) => {result ? resolve(result) : reject(`result's empty`)});
          
          socket.on('error', (error) => reject(error));
        } 
        else {
          const path = pathx.replace(/\{\S*\}/, '');
          const isPost = method === 'post';
          const req = new XMLHttpRequest();
          
          log(`+++ --> ${method} ${path}`, params);
          
          req.onerror = err => reject(err);
          req.open(method, isPost ? path : params ? path + params : path);
          req.setRequestHeader('Authorization', localStorage.getItem('jwt'));
          req.onload = () => {
            if (req.status === 200) resolve(JSON.parse(req.response));
            else reject(Error(req.statusText));
          };
          
          if (isPost) { 
            //stringify objects before POST XMLHttpRequest
            Object.keys(params).map(value => params[value] = typeof(params[value]) === 'object' ? JSON.stringify(params[value]) : params[value]);
            req.send(createForm(params));
          }
          else req.send();
        }
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
