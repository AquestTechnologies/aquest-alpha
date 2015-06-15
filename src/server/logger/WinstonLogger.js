import winston from 'winston';

class WinstonLogger extends winston.Logger{
  constructor() {
    super();
    
    this.tranports = [
      new (winston.transports.Console)({
          showLevel: false
        }),
        new (winston.transports.File)({
          name: 'info-file',
          filename: '/home/dherault_gmail_com/aquest-alpha/log/info.log',
          level: 'info',
          showLevel: false
        }),
        new (winston.transports.File)({
          name: 'error-file',
          filename: '/home/dherault_gmail_com/aquest-alpha/log/error.log',
          level: 'error',
          showLevel: false
        })
     ];
  }
}

export default WinstonLogger;