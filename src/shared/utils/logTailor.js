import fs from 'fs';
import path from 'path';
import isClient from './isClient';

export default function log(type, dataLog, err) {
  
  let filePath, logConfiguration;  
  let checkClient = isClient();
  
  if (!checkClient) {
    let fileLocation = path.join(__dirname.substring(0, __dirname.indexOf('/src/')), 'log');
    // console.log('file location : ' + fileLocation);
    
    let fileName = "info.log";
    filePath = path.join(fileLocation, fileName);
    // console.log('filepath : ' + filePath);
    
    logConfiguration = {
      separator: ' -- ',
      template: [
        // { date:['day','sep/','month','sep/','year','sep-','hours','sep:','minutes'] },
        { date:['day','sep/','month','sep/','year','sep-','hours','sep:','minutes'] },
        { dataLog: true }
      ]
    };
  } else {
    logConfiguration = {
      separator: ' -- ',
      template: [
        { dataLog: true }
      ]
    };
  }
  
  
  function transformDate(dateTable){
    let d = new Date();
    let transformedDate = '';
    
    dateTable.forEach(function(data) {
      if (data.substring(0, 3) == 'sep') {
        transformedDate += data.substring(3, data.length);
      }
      else{
        switch(data){
          case 'day':
            transformedDate += d.getDate();
            break;
            
          case 'month':
            transformedDate += d.getMonth()+1;
            break;
            
          case 'year':
            transformedDate += d.getFullYear();
            break;
            
          case 'hours':
            transformedDate += d.getHours()+2;
            break;
            
          case 'minutes':
            transformedDate += d.getMinutes();
            break;
        }
      }
    });
    
    return transformedDate;
  }
  
  let formatData = '';
  // console.log('we will log : ' + dataLog);
  if(dataLog == undefined){
    dataLog = type;
  } else {
    console.log(dataLog);
    
    //start format log for logfile
    formatData = type + logConfiguration.separator; 
  }
  
  if (logConfiguration.template) {
    for (let i = 0, confLength = logConfiguration.template.length; i < confLength; i++) {
      //on ajoute un séparateur si on est pas au début ou à la fin du template de log
      if (i != 0 && i != confLength) {formatData += logConfiguration.separator;}
      
      for (let key in logConfiguration.template[i]) {
        switch (key) {
          case 'date':
            formatData += transformDate(logConfiguration.template[i][key]);
            break;
          
          default:
            if (key == 'dataLog' && logConfiguration.template[i][key]) {
              formatData += dataLog;
              //si err a été passé en paramètre 
              if (err != undefined) {formatData += logConfiguration + err;}
            }
            break;
        }  
      }  
    }
  }
  
  //à condition que la transformation est été effective
  if (formatData != '') {dataLog = formatData;}
  
  //console.log('filePath : ' + filePath);
  
  //à mettre en asynchrone en cas de charge serveur importantes
  if (!checkClient) {
    fs.appendFile(filePath, dataLog +'\n', function(err) {
        if(err) {
            return console.log(err);
        }
    });
  }
}