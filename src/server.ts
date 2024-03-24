import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

import { logger } from './helpers/customLogger';
import { app } from './app';

// Listen for uncaught exception event
process.on('uncaughtException', (err) => {
  logger.error(`[UnhandledException]: ${err.message}`);
  process.exit(1);
});

// Load environment variables into Node.js process
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then((db) => {
    logger.info(`[MongoDB connected]: ${db.connection.host}`);
  })
  .catch((err) => {
    logger.error(`[Unable to connect to MongoDB]: ${err}`);
    process.exit(1);
  });

// Listen for incoming requests
const port = process.env.PORT ?? 3000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port} in ${process.env.NODE_ENV} mode`),
);

// Listen for unhandled promise rejection event
process.on('unhandledRejection', (err: unknown) => {
  if (err instanceof Error) {
    logger.error(`[UnhandledRejection]: ${err.message}`);
  } else {
    logger.error(`[UnhandledRejection]: ${String(err)}`);
  }
});

// Listen for termination signal event
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED! Shutting down...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});
