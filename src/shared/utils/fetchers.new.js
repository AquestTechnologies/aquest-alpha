import isClient from './isClient';
import log from './logTailor';

let isServer = !isClient();



var q = isServer ? require('../../server/queryDb') : {};
// console.log(q);

export function fetchUniverseByHandle(handle) {
  
  /*let formData = new FormData();
  formData.append('params', handle);
  
  log(formData);*/
  
  let query = {
    source: 'fetchUniverseByHandle',
    type: 'GET',
    params: handle
  };
  
  // log('+++ ' + query.source + ' | params : ' + query.params);
  
  return promiseFetch(query, 'api/universe/'+handle);
}

export function fetchUniverses() {

  let query = {
    source: 'fetchUniverses',
    type: 'GET',
    params: ''
  };
  
  // log('+++ ' + query.source + ' | params : ' + query.params);
  
  return promiseFetch(query, 'api/universes/');
}

export function fetchChat(id) {
  let query = {
    source: 'fetchChat',
    type: 'GET',
    params: id
  };
  
  // log('+++ ' + query.source + ' | params : ' + query.params);
  
  return promiseFetch(query, 'api/chat/'+id);
}

export function fetchInventory(universeId){
  let query = {
    source: 'fetchInventory',
    type: 'GET',
    params: universeId
  };
  
  // log('+++ ' + query.source + ' | params : ' + query.params);
  
  return promiseFetch(query, 'api/inventory/'+universeId);
}

export function fetchTopicByHandle(handle) {
  let query = {
    source: 'fetchTopicByHandle',
    type: 'GET',
    params: handle
  };
  
  // log('+++ ' + query.source + ' | params : ' + query.params);
  
  return promiseFetch(query, 'api/topic/'+handle);
}

export function fetchTopicContent(id) {
  let query = {
    source: 'fetchTopicContent',
    type: 'GET',
    params: id
  };
  
  // log('+++ ' + query.source + ' | params : ' + query.params);
  
  return promiseFetch(query, 'api/topic/content/'+id);
}

function promiseFetch(query, url) {
  return new Promise(function(resolve, reject) {
    if (isServer) {
      q(query).then(function(result) {
        if (result != null) {
          // log('+++ ' + query.source + ' ' + JSON.stringify(result));
          return resolve(result);
        }
        else {
          return reject('!!! promiseFetch error');
        }
      });
    }
    else {
      var req = new XMLHttpRequest();
      req.open(query.type, url);

      req.onload = function() {
        if (req.status == 200) {
          log('+++ ' + query.source + ' ' + JSON.stringify(req.response));
          resolve(JSON.parse(req.response));
        }
        else {
          reject(Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(Error("Erreur réseau"));
      };

      req.send();
    }
  }).catch(function(err) {
    log('error', err);
  });
}