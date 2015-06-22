import pg from 'pg';
import log from '../shared/utils/logTailor.js';
import query from 'pg-query';


//à voir : http://stackoverflow.com/questions/8484404/what-is-the-proper-way-to-use-the-node-js-postgresql-module

export default function dbCaller(){
  
  let client;
  
  var dbParameters = {
      host: '146.148.13.18',
      port: 5432,
      database: 'aquestdb',
      user: 'aquestuser',
      password: 'aquestuser'
  };
  
  function connect(){
    let postgresurl = 'postgres://'+dbParameters.user+':'+dbParameters.password+'@'+dbParameters.host+':'+dbParameters.port+'/'+dbParameters.database;
    client = new pg.Client(postgresurl);
    
    client.connect(function(err) {
      if(err) {
        return log('error','could not connect to postgres', err);
      }
    });
  }
  
  function end(){
    client.end();
  }
  
  function queryDb(aquery){
    log('info','sending query : ' + aquery.query);
    
    switch (aquery.type) {
      case 'insert':
        // code
        break;
      
      default:
        // select
        let result = query(aquery, function(err, rows) {
          if(err){
            console.log('!!! error query');
            return null;
          } else {
            if(rows) {
              return rows[0];
            }
          }
        });
        break;
    }
  }
  
}