import isClient from './isClient';
import fs from 'fs';

export default function log(type, message) {
  
  if (message === undefined) {
    message = type;
    type = 'info';
  }
  
  switch (type) {
    case 'error':
      console.error(message);
      break;
    case 'warn':
      console.warn(message);
      break;
    default:
      console.log(message);
  }

  if (!isClient()) {
    let d = new Date();
    let whatToLog = {
      type:   type,
      data:   message,
      date:   d.toLocaleString('fr'),
      year:   d.getFullYear(),
      month:  d.getMonth(),
      day:    d.getDate(),
      h:      d.getHours(),
      m:      d.getMinutes(),
      s:      d.getSeconds()
    };
    fs.appendFile('log/server.log', JSON.stringify(whatToLog) +'\n', function(err) {
        if(err) return console.log(err);
    });
  }
}