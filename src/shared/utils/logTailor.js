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
      case 'error':
        console.log(message instanceof Error ? message.stack : chalk.bgRed(message));
        break;
      case 'warn':
        console.log(chalk.bgYellow(message));
        break;
      default:
        let colorMatching = {
          '... ': 'grey',
          '.M. ': 'grey',
          '*** ': 'bgYellow',
          '.A. ': 'bgGreen',
          '.R. ': 'bgCyan',
          '+++ ': 'bgMagenta',
          '___ ': 'gbBlack'
        };
        let match = colorMatching[message.slice(0,4)];
        console.log(match ? chalk[match](message.slice(0,3)) + message.slice(3) : message);
    }
    let d = new Date();
    let whatToLog = {
      type:   type,
      data:   message,
      date:   d.toLocaleString('fr'), // :'( pas très local...
      year:   d.getFullYear(),
      month:  d.getMonth(),
      day:    d.getDate(),
      h:      d.getHours(),
      m:      d.getMinutes(),
      s:      d.getSeconds()
    };
    fs.appendFile('log/server.log', JSON.stringify(whatToLog) +'\n', function(err) {
      if (err) return console.log(err);
    });
  }
  
}