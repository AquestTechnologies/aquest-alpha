import isClient from './isClient.js';

export function fetchUniverse(){}

export function fetchUniverseByName(){}

export function fetchUniverseByHandle(handle){
  console.log('+++ NEW Fetching universeByHandle ' + handle);
  let checkClient = isClient();

  if(!checkClient){
    let DbCaller = require('../../server/DbCaller.js');
    var db = new DbCaller();
    db.connect();
  }
  
  //format l'objet
  let query = {
    source: 'fetchUniverseByHandle',
    parameters: handle
  }
  
  if(!checkClient){
    return new Promise(function (resolve, reject) {
      db.fetchUniverseByHandle(query).then(function(result) {
        if(result != null){
          let universeData = {
            id:          result.rows[0].universeId,
            name:        result.rows[0].name,
            description: result.rows[0].description,
            chatId:      result.rows[0].chatId,
          };
          
          console.log('fetchUniverseByHandle : ' + JSON.stringify(universeData));
          
          return resolve(universeData);
        } else  {
          reject('!!! middleFetcher error');
        }
      }).catch(function (reason) {
          console.log('RestAPI ', reason);
      });
    });
  } else {
    console.log('on the client');
    return new Promise(function(resolve, reject) {
      // Fais le boulot XHR habituel
      var req = new XMLHttpRequest();
      req.open('GET', 'api/universe/'+ handle);
  
      req.onload = function() {
        // Ceci est appelé même pour une 404 etc.
        // aussi vérifie le statut
        if (req.status == 200) {
          // Accomplit la promesse avec le texte de la réponse
          resolve(req.response);
        }
        else {
          // Sinon rejette avec le texte du statut
          // qui on l’éspère sera une erreur ayant du sens
          reject(Error(req.statusText));
        }
      };
  
      // Gère les erreurs réseau
      req.onerror = function() {
        reject(Error("Erreur réseau"));
      };
  
      // Lance la requête
      req.send();
    });
  }
}

export function fetchUniverses(){}

export function fetchTopics(){}

export function fetchChat(){}

export function fetchTopicContent() {}

export function fetchTopicByHandle() {}