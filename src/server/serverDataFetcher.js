import log      from '../shared/utils/logTailor.js';
import DbCaller from './DbCaller.js';
 
let db = new DbCaller();
db.connect();

export function fetchUniverse(){}
  
export function fetchUniverseByName(){}

export function fetchUniverseByHandle(handle){
  let sqlQuery = {
    type: 'select',
    query: 'SELECT universeId, name, description, handler, chatId FROM aquest_schema.universe WHERE handler=\'' + handle + '\''
  };
  
  return new Promise(function(resolve, reject) {
    // Appel de l'action
    db.queryDb(sqlQuery).then(function(result) {
      
      if(result != null){
        
        log('info', JSON.stringify(result));
        
        return resolve(result);  
      } else {
        reject('!!! Query promise rejected');
      }
    })
    .catch(function (reason) {
        log('serverFetcher ', reason);
    });
  });
}
  
export function fetchAllUniverses(){}

export function fetchTopics(){}

export function fetchChat(){}

export function fetchTopicContent() {}

export function fetchTopicByHandle() {}