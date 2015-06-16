let fs = require('fs');

class AqLogger{
  constructor() {
      
    this.fileLocation;  
    this.fileName;
    this.filePath = this.fileLocation + '/' + this.fileName;
    
    this.logConfiguration;
  }
  
  default(){
    this.fileLocation = "/home/dherault_gmail_com/aquest-alpha/log";
    this.fileName = "info.log";
    this.logConfiguration = {
      date: ''  
    }
  }
  
  log(dataLog){
    fs.writeFile(this.filePath, dataLog, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(dataLog);
    });
  }
}

export default AqLogger;