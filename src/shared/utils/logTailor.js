import isClient from './isClient';
import chalk from 'chalk';
import fs from 'fs';

export default function log(type, ...messages) {
  
  if (messages[0]) messages.forEach(msg => logOneEntry(type, msg));
  else logOneEntry('info', type);
  
  function logOneEntry(type, message) {
  
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
          if (typeof message === 'string') {
            let colorMatching = {
              '...': 'grey',
              '.M.': 'grey',
              '***': 'bgYellow',
              '.A.': 'bgGreen',
              '.R.': 'bgCyan',
              '+++': 'bgMagenta',
              '_w_': 'gbBlack'
            };
            const prefix = message.slice(0,3);
            const match  = colorMatching[prefix];
            console.log(match ? chalk[match](prefix) + message.slice(3) : message);
          }
          else {
            console.log(message);
          }
      }
      const d = new Date();
      const whatToLog = {
        type:  type,
        data:  message,
        date:  d.toLocaleString('fr'), // :'( pas très local...
        year:  d.getFullYear(),
        month: d.getMonth(),
        day:   d.getDate(),
        h:     d.getHours(),
        m:     d.getMinutes(),
        s:     d.getSeconds()
      };
      fs.appendFile('log/server.log', JSON.stringify(whatToLog) +'\n', err => {
        if (err) console.log(err);
      });
    }
  }
  
}

let c = 0;
export function logRequest(request) {
  c++;
  function preprendZero(i) {
    const ii = i.toString();
    return ii.length > 1 ? ii : '0' + ii;
  }
  
  const d = new Date();
  const Y = d.getFullYear();
  const D = preprendZero(d.getDate());
  const M = preprendZero(d.getMonth());
  const h = preprendZero(d.getHours());
  const m = preprendZero(d.getMinutes());
  const s = preprendZero(d.getSeconds());
  log(`\n[${c}] ${D}-${M}-${Y} ${h}:${m}:${s} ${request.info.remoteAddress}:${request.info.remotePort} ${request.method} ${request.url.path}`);
}

export function logWelcome(x) {
  if (x) {
    log('\n_-\' Welcome to Aquest v0.0.2 \'-_\n' +
      'Enjoy your visit.\n' +
      'contact : hello@aquest.fr\n ');
    log('Hack us and get good French stuff shipped to you worldwide!\n' +
      'Just don\'t arm our business too much please.\n ');
    log('© 2015 Aquest Technologies SAS.\n' + 
    'Should be open-sourced when the above hacking program ends.\n '); // t'en penses quoi ?
    log('Made with many open-source technologies including but not limited to: ' + // permet d'attribuer temporairement (pas vraiment legalement valable)
    '(Full licence available at http//aquest.fr/404)\n' +
    '- Node.js\n' +
    '- PostgreSQL\n' +
    '- rabbitMQ\n' +
    '- Hapi.js\n' +
    '- Socket.IO\n' +
    '- Redux\n' +
    '- React\n' +
    'Thanks to everyone who contributed! \n ');
    log('\n... Rock\'n\'roll\n ');
  }
}