import pg from 'pg';
import log from '../shared/utils/logTailor.js';
import isClient from '../shared/utils/isClient.js';

class DbCaller {
  
  constructor() {
    this.bdUser     = 'aquestuser';
    this.bdPassword = 'aquestuser';
    this.bdIp       = '146.148.13.18'; 
    this.bdPort     = '5432'; 
    this.bdName     = 'aquestdb';
    this.client;
  }
  
  connect(){
    let postgresurl = 'postgres://'+this.bdUser+':'+this.bdPassword+'@'+this.bdIp+':'+this.bdPort+'/'+this.bdName;
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
  
  query(aquery){
    let client = this.client;
    
    return new Promise(function(resolve,reject){
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
    });
  }
  
}

export default DbCaller;