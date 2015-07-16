import isClient from './isClient';
import log from './logTailor';

const isServer = !isClient();



const q = isServer ? require('../../server/queryDb') : {};

export function fetchUniverse(id) {
  
  const query = {
    source: 'fetchUniverse',
    type: 'GET',
    params: id
  };
  
  return promiseFetch(query, '/api/universe/'+id);
}

export function fetchUniverses() {

  const query = {
    source: 'fetchUniverses',
    type: 'GET',
    params: ''
  };
  
  return promiseFetch(query, '/api/universes/');
}

export function fetchChat(id) {
  const query = {
    source: 'fetchChat',
    type: 'GET',
    params: id
  };
  
  return promiseFetch(query, '/api/chat/'+id);
}

export function fetchInventory(universeId){
  const query = {
    source: 'fetchInventory',
    type: 'GET',
    params: universeId
  };
  
  return promiseFetch(query, '/api/inventory/'+universeId);
}

export function fetchTopic(universeId) {
  const query = {
    source: 'fetchTopicByHandle',
    type: 'GET',
    params: universeId
  };
  
  return promiseFetch(query, '/api/topic/'+universeId);
}

export function fetchTopicContent(id) {
  const query = {
    source: 'fetchTopicContent',
    type: 'GET',
    params: id
  };
  
  return promiseFetch(query, '/api/topic/content/'+id);
}

export function addUniverse(universe) {
  
  const query = {
    source: 'addUniverse',
    type: 'POST',
    params: universe
  };
  
  return promiseFetch(query, '/api/universe/');
}

export function addTopic(topic) {
  
  const query = {
    source: 'addTopic',
    type: 'POST',
    params: topic
  };
  
  return promiseFetch(query, '/api/topic/');
}

export function addChatMessage(message) {
  
  const query = {
    source: 'addChatMessage',
    type: 'POST',
    params: message
  };
  
  return promiseFetch(query, '/api/chatMessage/');
}

function promiseFetch(query, url) {
  
  return new Promise((resolve, reject) => {
    if (isServer) {
      
      q(query).then(
        result => {
          if (result) {
            log(`+++ ${query.source} ${result instanceof Array} ${result}`);
            resolve(result);
          }
          else {
            reject('!!! promiseFetch error');
          }
        },
        error => reject(error)
      );
      
    } else {
      
      const req = new XMLHttpRequest();
      const {type, source, params} = query;
      req.open(query.type, url);
      
      req.onload = () => {
        if (req.status === 200) {
          log('+++ ' + source + ' ' + req.response);
          let result = JSON.parse(req.response);
          resolve(result);
        }
        else {
          reject(Error(req.statusText));
        }
      };
      
      req.onerror = () => {
        reject(Error("Erreur réseau"));
      };
      
      if (type === 'POST') {
        const form  = new FormData();
        
        // We push our data into our FormData object
        for(let key in params) {
          form.append(key, params[key]);
        }
        
        req.send(form);
      } else {
        req.send();
      }
    }
  });
}