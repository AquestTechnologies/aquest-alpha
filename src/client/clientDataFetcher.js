import log      from '../shared/utils/logTailor.js';

let url = 'http://130.211.68.244:8080/api';

export function fetchUniverse(){}

export function fetchUniverseByName(){}

export function fetchUniverseByHandle(handle){
  console.log('+++ Client Data Fetching universeByHandle ' + handle);
  return new Promise(function(resolve, reject) {
    // Fais le boulot XHR habituel
    var req = new XMLHttpRequest();
    req.open('GET', url + '/universe/'+ handle);

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

export function fetchAllUniverses(){}

export function fetchTopics(){}

export function fetchChat(){}

export function fetchTopicContent() {}

export function fetchTopicByHandle() {}