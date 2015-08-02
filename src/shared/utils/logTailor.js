import isClient from './isClient';
import fs from 'fs';
import chalk from 'chalk';

const isServer = !isClient();
const colorMatching = {
  '!!!': {
    text: 'red'
  },
  '...': {
    text: 'gray'
  },
  '.M.': {
    text: 'gray'
  },
  '***': {
    text: 'white',
    bg: 'yellow'
  },
  '.A.': {
    text: 'white',
    bg: 'green',
    bgClient : 'YellowGreen'
  },
  '.R.': {
    text: 'white',
    bg: 'cyan',
    bgClient: 'SkyBlue'
  },
  'jwt': {
    text: 'black',
    bg: 'white',
  },
  '.E.': {
    text: 'white',
    bg: 'cyan',
    bgClient: 'Gold'
  },
  '+++': {
    text: 'white',
    bg: 'magenta',
    bgClient: 'LightPink'
  },
  '_w_': {
    text: 'white',
    bg: 'black'
  },
};

export default function log(...messages) {
  
  const firstMessage = messages[0];
  
  if (typeof firstMessage === 'string') {
    const prefix = firstMessage.slice(0, 3);
    const match  = colorMatching[prefix];
    
    if (match) {
      const {text, bg, bgClient} = match;
      messages.shift();
      
      if (isServer) console.log(chalk[bg ? 'bg' + bg.slice(0, 1).toUpperCase() + bg.slice(1) : text](prefix), firstMessage.slice(3), ...messages);
      else {
        let css = `color:${text};`;
        css += bg ? bgClient ? `background:${bgClient};` : `background:${bg};` : '';
        console.log(`%c${prefix}`, css, firstMessage.slice(3), ...messages);
      }
    }
    else console.log(...messages);
  } 
  else console.log(...messages);
    
  if (isServer) {
    const d = new Date();
    fs.appendFile('log/server.log', JSON.stringify({
      data:  messages.join(' '),
      date:  d.toLocaleString('fr'), // :'( pas très local...
      year:  d.getFullYear(),
      month: d.getMonth(),
      day:   d.getDate(),
      h:     d.getHours(),
      m:     d.getMinutes(),
      s:     d.getSeconds()
    }) +'\n', err => {
      if (err) console.log(err);
    });
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
  log(`\n[${c}]`, ` ${D}-${M}-${Y} ${h}:${m}:${s} ${request.info.remoteAddress}:${request.info.remotePort} ${request.method} ${request.url.path}`);
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

export function logAuthentication(source, userId, expiration) {
  log(source + ':', userId ? userId : 'Visitor', expiration ? `(${Math.round((expiration - new Date().getTime()) / (60 * 1000))}min left)` : '');
}
