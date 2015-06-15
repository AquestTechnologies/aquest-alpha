import pg from 'pg';
import winstonLogger from '../logger/Winstonlogger.js';

class DbCaller {
  
  constructor() {
    super();
    this.bdUser = 'aquestuser';
    this.bdPassword = 'aquestuser';
    this.bdIp = '146.148.13.18'; 
    this.bdPort = '5432'; 
    this.bdName = 'aquestdb';
    this.client;
    
    this.logger = new winstonLogger().logger;
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
          return this.logger.info('could not connect to postgres', err);
        }
        this.client.query(aquery, function(err, result) {
          if(err) {
            return this.logger.info('error running query', err);
          }
          
          this.logger.info('universe : '+ result.rows[0]);
          
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