import isClient from './isClient.js';

let isServer = !isClient();

if(isServer){
  var q = require('../../server/queryDb.js');
}

export function fetchUniverseByHandle(handle) {
  
  let query = {
    source: 'fetchUniverseByHandle',
    parameters: handle
  };
  
  console.log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/universe/'+handle);
}

export function fetchUniverses() {

  let query = {
    source: 'fetchUniverses',
    parameters: ''
  };
  
  console.log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/universes/');
}

export function fetchChat(id) {
  let query = {
    source: 'fetchChat',
    parameters: id
  };
  
  console.log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/chat/');
}

export function fetchTopicByHandle(handle) {
  let query = {
    source: 'fetchTopicByHandle',
    parameters: handle
  };
  
  console.log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/topic/');
}

export function fetchTopicContent(id) {
  let query = {
    source: 'fetchTopicContent',
    parameters: id
  };
  
  console.log('+++ ' + query.source + ' | parameters : ' + query.parameters);
  
  return promiseFetch(query, 'api/topic/content/');
}

function promiseFetch(query, url){
  return new Promise(function (resolve, reject) {
    if(isServer){
      console.log('+++ server');
      q.queryDb(query).then(function(result) {
        if(result != null){
          console.log(query.source + ' ' + JSON.stringify(result));
          return resolve(result);
        } else  {
          reject('!!! middleFetcher error');
        }
      });
    } else {
      console.log('+++ client');
      var req = new XMLHttpRequest();
      req.open('GET', url);
  
      req.onload = function() {
        if (req.status == 200) {
          console.log(query.source + ' ' + JSON.stringify(req.response));
          resolve(req.response);
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
  }).catch(function (err) {
      console.log('RestAPI ', err.stack);
  });
}