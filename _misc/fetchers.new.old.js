import isClient from './isClient.js';
import log      from './logTailor.js';

/**
 * Description : fonction utilisée pour récupérer les données.
 * Le post traitement se fait dans le fetch, et non dans le Store.
 * */
let dataFetcher;
if(!isClient()){
  //ne fonctionnera que côté serveur puisque ce fichier ne sera pas dans le bundle.js
  dataFetcher = require('../../server/serverFetcher.js');
} else {
  //on pourra le mettre dans shared, mais cette fonction ne sera pas vraiment partagé avec le serveur...
  dataFetcher = require('../../client/clientDataFetcher.js');
}

export function fetchUniverse(){}

export function fetchUniverseByName(){}

export function fetchUniverseByHandle(handle){
  console.log('+++ NEW Fetching universeByHandle ' + handle);
  
  // Retourne une promise à l'action.
  return new Promise(function (resolve, reject) {
    dataFetcher.fetchUniverseByHandle(handle).then(function(result) {
      if(result != null){
        let universeData = {
          id:          result.rows[0].universeId,
          name:        result.rows[0].name,
          description: result.rows[0].description,
          chatId:      result.rows[0].chatId,
        };
        
        return resolve(universeData);
      } else  {
        reject('!!! middleFetcher error');
      }
    }).catch(function (reason) {
        log('RestAPI ', reason);
    });
  });
}

export function fetchUniverses(){}

export function fetchTopics(){}

export function fetchChat(){}

export function fetchTopicContent() {}

export function fetchTopicByHandle() {}