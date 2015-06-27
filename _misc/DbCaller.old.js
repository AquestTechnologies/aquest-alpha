import pg from 'pg';
import log from '../shared/utils/logTailor.js';
import query from 'pg-query';

export default class DbCaller {
  
  constructor() {
    this.user     = 'aquestuser';
    this.password = 'aquestuser';
    this.host     = '146.148.13.18'; 
    this.port     = '5432'; 
    this.database = 'aquestdb';
    this.client;
  }
  
  connect(){
    let postgresurl = 'postgres://'+this.user+':'+this.password+'@'+this.host+':'+this.port+'/'+this.database;
    //query.connectionParameters = postgresurl;
    console.log('login into ' + this.database + ' through ' + postgresurl);
    this.client = new pg.Client(postgresurl);
    
    this.client.connect(function(err) {
      if(err) {
        return log('error','could not connect to postgres', err);
      }
    });
  }
  
  end(){
    this.client.end();
  }
  
  queryDb(queryP){
    let client = this.client;
    let self = this;
    let buildQuery = '';
    
    console.log('queryDb : ' + JSON.stringify(queryP));
    
    switch (queryP.source) {
      case 'insert':
        // code
        break;
        
      case 'fetchUniverseByHandle':
        
        buildQuery = 'SELECT universeId, name, description, handler, chatId FROM aquest_schema.universe WHERE handler=\'' + queryP.parameters + '\'';
        
        console.log('will trigger query : ' + buildQuery);
        
        return new Promise(function(resolve,reject){
          client.query(buildQuery, function(err, result) {
            if(err) {
              log('error','error running query', err);
              reject('error running query : ' + err);
            }
            
            if(result.rows[0] !== undefined){
              log('info','universe : '+ JSON.stringify(result.rows[0]));
              resolve(result);
            }
            
            reject('error running query : ' + err);
          });
        });
        break;//ligne optionnelle étant donné le return ci-dessus ?
      
      default:
        buildQuery = 'SELECT universeId, name, description, handler, chatId FROM aquest_schema.universe WHERE handler=\'' + queryP.parameters + '\'';
        
        return new Promise(function(resolve,reject){
          client.query(buildQuery, function(err, result) {
            if(err) {
              log('error','error running query', err);
              reject('error running query : ' + err);
            }
            
            if(result.rows[0] !== undefined){
              log('info','universe : '+ JSON.stringify(result.rows[0]));
              resolve(result);
            }
            
            reject('error running query : ' + err);
          });
        });
        break;
    }
    
    /*return new Promise(function(resolve,reject){
      client.query(aquery, function(err, result) {
        if(err) {
          log('error','error running query', err);
          reject('error running query : ' + err);
        }
        
        if(result.rows[0] !== undefined){
          log('info','universe : '+ JSON.stringify(result.rows[0]));
          resolve(result);
        }
        
        reject('error running query : ' + err);
      });
    });*/
  }
  
  cbQuery(err,rows){
    if(err){
      console.log('!!! error queryDb -> query : ' + err.stack);
    } else {
      if(rows)
      return rows[0];
    }
  }
  
}