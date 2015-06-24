import isClient from './isClient';
import chalk from 'chalk';
import fs from 'fs';

export default function log(type, message) {
  
  if (message === undefined) {
    message = type;
    type = 'info';
  }
  

  if (isClient()) {
    switch (type) {
      case 'info':
        console.log(message);
        break;
      case 'error':
        console.error(message);
        break;
      case 'warn':
        console.warn(message);
        break;
      default:
        console.log(message);
    }
  }
  else {
    switch (type) {
      case 'info':
        consoleLogWithColor(message);
        break;
      case 'error':
        consoleLogError(message);
        break;
      case 'warn':
        console.log(chalk.bgYellow(message));
        break;
      default:
        consoleLogWithColor(message);
    }
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
  
  function consoleLogWithColor(message) {
    let colorMatching = {
      '... ': 'grey',
      '.M. ': 'grey',
      '*** ': 'bgYellow',
      '.A. ': 'bgGreen',
      '.R. ': 'bgCyan',
      '+++ ': 'bgMagenta',
      '___ ': 'gbBlack'
    };
    let prefixWithSpace = message.slice(0,4);
    let prefix          = message.slice(0,3);
    let rest            = message.slice(3);
    
    let match = colorMatching[prefixWithSpace];
    if (match) {
      console.log(chalk[match](prefix) + rest);
    } 
    else {
      console.log(message);
    }
  }
  
  function consoleLogError(message) {
    if (message instanceof Error) {
      console.log(message.stack);
    } 
    else {
      console.log(chalk.bgRed(message));
    }
  }
}