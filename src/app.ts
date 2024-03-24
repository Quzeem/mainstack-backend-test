import express, { Request, Response } from 'express';
import 'express-async-errors';
import httpError from 'http-errors';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';

import { globalErrorHandler } from './middlewares/error.middleware';
import { authRouter } from './routes/auth.routes';
import { productRouter } from './routes/product.routes';

const app = express();

// Enable 'trust proxy' setting
app.set('trust proxy', true);

// Enable cors
app.use(cors());

// Parse incoming request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set security HTTP response headers
app.use(helmet());

// Limit repeated requests to API endpoints, preventing abuse and potential denial-of-service attacks
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator(request: Request, _response: Response): string {
    if (!request.ip) {
      console.error('Warning: request.ip is missing!');
      return request.socket.remoteAddress!;
    }

    return request.ip.replace(/:\d+[^:]*$/, '');
  },
});
app.use(limiter);

// Sanitize user-supplied data to prevent MongoDB query injection
app.use(mongoSanitize());

// sanitize and protect against parameter pollution in Express.js applications
app.use(hpp());

// Reduces the size of HTTP responses by compressing them before sending them over the network
app.use(compression());

app.get('/', (req: Request, res: Response) => res.status(200).send('Server is up and running!!!'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.all('*', (req: Request) => {
  throw new httpError.NotFound(
    `${req.method} request to: ${req.originalUrl} not available on this server`,
  );
});
app.use(globalErrorHandler);

export { app };
