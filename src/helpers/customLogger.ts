import { transports, format, createLogger } from 'winston';

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp: ts }) => `${ts} [${level}]: ${message}`);

/** Custom winston logger */
const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), customFormat),
  transports: [
    // Write all logs with level `error` and below to error folder
    new transports.File({
      dirname: 'logs',
      filename: 'error.log',
      level: 'error',
      format: format.json(),
    }),

    // Write all logs with level `info` and below to combined folder
    new transports.File({
      dirname: 'logs',
      filename: 'combined.log',
      format: format.json(),
    }),

    // Log to console
    new transports.Console({
      format: combine(format.colorize(), customFormat),
      handleExceptions: true,
    }),
  ],
});

export default logger;
