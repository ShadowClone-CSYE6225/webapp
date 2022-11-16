const { path } = require('app-root-path');
const winston = require('winston')
const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;
const dotenv = require('dotenv');
dotenv.config();




const myFormat = printf( ({ level, message, timestamp}) => {
    let msg = `${timestamp} [${level}] : ${message} `
    return msg
  });


const options = {
    file: {
    'timestamp': true,
      level: 0,
      filename: process.env.System ? `${path}\\logs\\Application.log`:`${path}/logs/Application.log`,
      handleExceptions: true,
      json: true,
      maxsize: 1048576, // 1MB
      maxFiles: 5,
      colorize: false,
      
    },
    error: {
        level: 'error',
        filename: `${path}\\logs\\Application.log`,
        handleExceptions: true,
        json: true,
        maxsize: 1048576, // 1MB
        maxFiles: 5,
        colorize: true,
      },
    console: {
    filename: `${path}\\logs\\Application.log`,
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true,
    },
  };



const logger = winston.createLogger({
    format: combine(
        splat(),
        timestamp(),
        myFormat
      ),
        transports: [
            new winston.transports.File(options.file),
            new winston.transports.File(options.console),
            new winston.transports.File(options.error)
       ],
       exitOnError: false
    });
    

    logger.stream = {
        write: function(message, encoding) {
          logger.info(message);
        },
      }; 
    
    
    
    
    module.exports = logger;