import isClient from './isClient';
import log from './logTailor';

const isServer = !isClient();
const q = isServer ? require('../../server/queryDb') : {};

export function getUniverse(id) {
  
  const query = {
    source: 'getUniverse',
    type: 'GET',
    params: id
  };
  
  return promiseFetch(query, `/api/universe/${id}`);
}

export function getUniverses() {

  const query = {
    source: 'getUniverses',
    type: 'GET',
    params: ''
  };
  
  return promiseFetch(query, '/api/universes/');
}

export function getChat(id) {
  const query = {
    source: 'getChat',
    type: 'GET',
    params: id
  };
  
  return promiseFetch(query, `/api/chat/${id}`);
}

export function getInventory(universeId){
  const query = {
    source: 'getInventory',
    type: 'GET',
    params: universeId
  };
  
  return promiseFetch(query, `/api/inventory/${universeId}`);
}

export function getTopic(universeId) {
  const query = {
    source: 'getTopic',
    type: 'GET',
    params: universeId
  };
  
  return promiseFetch(query, `/api/topic/${universeId}`);
}

export function getTopicContent(id) {
  const query = {
    source: 'getTopicContent',
    type: 'GET',
    params: id
  };
  
  return promiseFetch(query, `/api/topic/content/${id}`);
}

export function postUniverse(universe) {
  
  const query = {
    source: 'postUniverse',
    type: 'POST',
    params: universe
  };
  
  return promiseFetch(query, '/api/universe/');
}

export function postTopic(topic) {
  
  const query = {
    source: 'postTopic',
    type: 'POST',
    params: topic
  };
  
  return promiseFetch(query, '/api/topic/');
}

export function postMessage(message) {
  
  const query = {
    source: 'postMessage',
    type: 'POST',
    params: message
  };
  
  return promiseFetch(query, '/api/chatMessage/');
}

export function postUser(user) {
  
  const query = {
    source: 'postUser',
    type: 'POST',
    params: user
  };
  
  return promiseFetch(query, '/api/user/');
}

function promiseFetch(query, url) {
  
  return new Promise((resolve, reject) => {
    if (isServer) {
      
      q(query).then(
        result => resolve(result),
        error => reject(error)
      );
      
    } else {
      
      const {type, source, params} = query;
      console.log(`+++ --> ${type} ${source} : `, params); //logTailor ne peut être utilisé ici
      
      const req = new XMLHttpRequest();
      req.open(query.type, url);
      req.onerror = () => reject(Error("Error during HTTP request"));
      
      req.onload = () => {
        if (req.status === 200) {
          const result = JSON.parse(req.response);
          console.log(`+++ <-- ${source} : `, result);
          resolve(result);
        }
        else {
          reject(Error(req.statusText));
        }
      };
      
      if (type === 'POST') {
        let form  = new FormData();
        
        // We push our data into our FormData object
        for(let key in params) {
          form.append(key, params[key]);
        }
        
        log(form);
        
        req.send(form);
      } else {
        req.send();
      }
    }
  });
}