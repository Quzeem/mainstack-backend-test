import express, { Request, Response } from 'express';
import 'express-async-errors';
import httpError from 'http-errors';

import globalErrorHandler from './middlewares/error.middleware';
import authRouter from './routes/auth.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => res.status(200).send('Server is up and running!!!'));
app.use('/api/v1/auth', authRouter);
app.all('*', (req: Request) => {
  throw new httpError.NotFound(
    `${req.method} request to: ${req.originalUrl} not available on this server`,
  );
});
app.use(globalErrorHandler);

export default app;
