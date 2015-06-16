import pg from 'pg';
import LogTailor from '/home/dherault_gmail_com/aquest-alpha/src/server/logger/LogTaillor.js';

class DbCaller {
  
  constructor() {
    super();
    this.bdUser = 'aquestuser';
    this.bdPassword = 'aquestuser';
    this.bdIp = '146.148.13.18'; 
    this.bdPort = '5432'; 
    this.bdName = 'aquestdb';
    this.client;
    
    this.logger = new LogTailor();
    this.logger.default();
  }
  
  connect(){
    let postgresurl = 'postgres://'+this.bdUser+':'+this.bdPassword+'@'+this.bdIp+':'+this.bdPort+'/'+this.bdName;
    this.client = new pg.Client(postgresurl);
  }
  
  end(){
    this.client.end();
  }
  
  query(aquery){
    this.client.connect(function(err) {
        if(err) {
          return this.logger.tail('could not connect to postgres', err);
        }
        this.client.query(aquery, function(err, result) {
          if(err) {
            return this.logger.tail('error running query', err);
          }
          
          this.logger.tail('universe : '+ result.rows[0]);
          
          if(result.rows[0] !== undefined){
            return result;
          } else {
            return null;
          }
        });
      });
  }
  
}

export default DbCaller;