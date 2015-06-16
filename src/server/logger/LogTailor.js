let fs = require('fs');

class LogTailor{
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
      separator: '--',
      template: [
        [
          'date',
          {  
            day: true,
            separator: '/',
            month: true,
            separator: '/',
            year: true,
            separator: '-',
            hours: true,
            separator: ':',
            minutes: true,
          }
        ],
        [
          'dataLog'  
        ]
      ]
    }
  }
  
  transformDate(dateObject){
    let currentDate = new Date();
    let transformedDate;
    
    for(let key in dateObject){
      if(key != 'separator'){
        if(typeof dateObject[key] === 'boolean' && dateObject[key] && key == 'day'){transformedDate += currentDate.getDate();}
        if(typeof dateObject[key] === 'boolean' && dateObject[key] && key == 'month'){transformedDate += currentDate.getMonth();}
        if(typeof dateObject[key] === 'boolean' && dateObject[key] && key == 'year'){transformedDate += currentDate.getYear();}
        if(typeof dateObject[key] === 'boolean' && dateObject[key] && key == 'hours'){transformedDate += currentDate.getHours();}
        if(typeof dateObject[key] === 'boolean' && dateObject[key] && key == 'minutes'){transformedDate += currentDate.getMinutes();}
      } else {
        transformedDate += dateObject[key];
      }
    }
    
    return transformedDate;
  }
  
  tail(dataLog){
    
    console.log('filepath : ' + this.filePath);
    console.log('we will log : ' + dataLog);
    
    
    //dataLog va être formater selon l'object logConfiguration et stocké temporairement dans formatData
    let formatData;
    
    this.logConfiguration.template.foreach(function(templateItem, index, array){
      
      let currentElement = templateItem[1];
      
      //on ajoute un séparateur si on est pas au début ou à la fin du template de log
      if(index !=0 && index != array.length-1){formatData += this.logConfiguration.separator;}
      
      switch(templateItem[0]){
        case 'date':
          formatData += this.transformDate(currentElement);
        break;
        
        default:
          formatData += dataLog;
        break;
      }
    });
    
    //à condition que la transformation est été effective
    if(formatData != ''){dataLog = formatData;}
    
    fs.writeFile(this.filePath, dataLog, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(dataLog);
    });
  }
}

export default LogTailor;