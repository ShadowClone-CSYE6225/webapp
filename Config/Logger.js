const { path } = require('app-root-path');
const dotenv = require('dotenv');
dotenv.config();

const winston = require('winston')


const options = {
    file: {
      level: 'info',
      filename: `${path}/logs/Application.log`,
      handleExceptions: true,
      json: true,
      maxsize: 1048576, // 1MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };



const logger = new winston.createLogger({
        format: winston.format.json(),
        transports: [
            new winston.transports.File(options.file),
            new winston.transports.File(options.console)
       ],
       exitOnError: false
    });
    

    logger.stream = {
        write: function(message, encoding) {

          logger.info(message);
        },
      }; 
    
    
    
    
    module.exports = logger;