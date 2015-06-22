import log      from '../shared/utils/logTailor.js';

export default function serverFetcher(){
  
  function fetchUniverse(){}
  
  function fetchUniverseByName(){}
  
  function fetchUniverseByHandle(handle){
    let sqlQuery = 'SELECT universeId, name, description, chatId FROM aquest_schema.universe WHERE handler=\'' + handle + '\'';
    
    return new Promise(function(resolve, reject){
      
    })
  }
  
  function fetchAllUniverses(){}
  
  function fetchTopics(){}
  
  function fetchChat(){}
  
  function fetchTopicContent() {}

  function fetchTopicByHandle() {}
  
}