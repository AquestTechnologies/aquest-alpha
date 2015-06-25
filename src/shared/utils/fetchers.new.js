import isClient from './isClient.js';
import log from './logTailor.js';

let isServer = !isClient();

if(isServer){
  var q = require('../../server/queryDb.js');
}

export function fetchUniverseByHandle(handle) {
  
  let query = {
    source: 'fetchUniverseByHandle',
    parameters: handle
  };
  
  log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/universe/'+handle);
}

export function fetchUniverses() {

  let query = {
    source: 'fetchUniverses',
    parameters: ''
  };
  
  log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/universes/');
}

export function fetchChat(id) {
  let query = {
    source: 'fetchChat',
    parameters: id
  };
  
  log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/chat/');
}

export function fetchInventory(universeId){
  let query = {
    source: 'fetchInventory',
    parameters: universeId
  };
  
  log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/inventory/');
}

export function fetchTopicByHandle(handle) {
  let query = {
    source: 'fetchTopicByHandle',
    parameters: handle
  };
  
  log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/topic/');
}

export function fetchTopicContent(id) {
  let query = {
    source: 'fetchTopicContent',
    parameters: id
  };
  
  log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/topic/content/');
}

function promiseFetch(query, url) {
  return new Promise(function(resolve, reject) {
    if (isServer) {
      log('+++ server');
      q.queryDb(query).then(function(result) {
        if (result != null) {
          log('+++ ' + query.source + ' ' + JSON.stringify(result));
          return resolve(result);
        }
        else {
          reject('!!! middleFetcher error');
        }
      });
    }
    else {
      log('+++ client');
      var req = new XMLHttpRequest();
      req.open('GET', url);

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
    log('RestAPI ', err.stack);
  });
}