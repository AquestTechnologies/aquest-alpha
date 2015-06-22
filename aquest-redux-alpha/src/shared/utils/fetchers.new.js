import isClient from './isClient.js';
import log      from './logTailor.js';

/**
 * Description : fonction utilisée pour récupérer les données.
 * Le post traitement se fait dans le fetch, et non dans le Store.
 * */


export default function MiddelFetcher(){
  
  let dataFetcher;
  if(!isClient()){
    //ne fonctionnera que côté serveur puisque ce fichier ne sera pas dans le bundle.js
    dataFetcher = require('../../server/serverFetcher.js');
  } else {
    //on pourra le mettre dans shared, mais cette fonction ne sera pas vraiment partagé avec le serveur...
    dataFetcher = require('../../client/clientDataFetcher.js');
  }
  
  function fetchUniverse(){
    
  }
  
  function fetchUniverseByName(){}
  
  function fetchUniverseByHandle(handle){
    console.log('+++ Fetching universeByHandle ' + handle);
    
    // Retourne une promise à l'action.
    return new Promise(function (resolve, reject) {
      dataFetcher.fetchUniverseByHandle(handle).then(function(result) {
        if(result != null){
          
          //mise en forme
          let data = {
            id: 1,
            chatId: 1,
            name: "Startups",
            description: "This is a place where stuff gets done.",
            picturePath: "http://130.211.68.244:8080/img/pillars_compressed.png",
            handle: "Startups"
          }
          return resolve(data);
        } else  {
          reject('!!! middleFetcher error');
        }
      }).catch(function (reason) {
          log('RestAPI ', reason);
      });
    });
  }
  
  function fetchAllUniverses(){}
  
  function fetchTopics(){}
  
  function fetchChat(){}
  
  function fetchTopicContent() {}

  function fetchTopicByHandle() {}
  
}